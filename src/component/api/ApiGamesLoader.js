import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { withRouter } from "react-router-dom";

import { apiFetch } from "../../util";
import { processGamesResponse } from "../../models/api";
import { subscribeTo, AppStateContainer } from "../../state";

const responseCache = {};

function getCachedResponse(endpoint) {
  if (!endpoint || !responseCache.hasOwnProperty(endpoint)) {
    return undefined;
  }

  return responseCache[endpoint];
}

class ApiGamesLoader extends React.PureComponent {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    filter: PropTypes.func,
  };

  state = {
    lastEndpoint: null,
    games: undefined,
    loading: false,
  };

  static getDerivedStateFromProps(props, state) {
    let returnedState = null;
    const { endpoint, staticContext } = props;
    const { lastEndpoint } = state;

    if (lastEndpoint === null || endpoint !== lastEndpoint) {
      let games = undefined;

      if (staticContext && staticContext.responses.gamesLoader[endpoint]) {
        games = staticContext.responses.gamesLoader[endpoint];
      } else {
        games = getCachedResponse(endpoint);
      }

      returnedState = {
        lastEndpoint: endpoint,
        games,
      };
    }

    return returnedState;
  }

  constructor(props) {
    super(props);

    this.state.loading = this.load(true);
  }

  componentDidUpdate() {
    this.load();
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { games, loading } = this.state;
    const { children } = this.props;

    return children(games, loading);
  }

  /**
   * Starts the data fetching depending on the environment and context.
   * @param {bool} runInConstructor Should be set to true if the method is run from the constructor.
   * @returns {bool} Whether data fetching was or will be (after setState) initiated.
   */
  load(runInConstructor = false) {
    const { games, loading } = this.state;
    let { endpoint } = this.props;

    if (games !== undefined || loading || !endpoint) {
      return false;
    }

    const { staticContext } = this.props;

    if (staticContext) {
      if (staticContext.secondRun) {
        return false;
      }

      this.doLoad();

      return true;
    }

    /**
     * Can't call setState from the constructor and can't load
     * in componentDidMount because of SSR.
     */
    if (runInConstructor) {
      this.doLoad();

      return true;
    }

    this.setState(
      {
        loading: true,
      },
      this.doLoad
    );

    return true;
  }

  doLoad = () => {
    let { endpoint, staticContext } = this.props;

    if (this.requestSource) {
      this.requestSource.cancel();
    }

    this.requestSource = axios.CancelToken.source();

    const request = apiFetch(endpoint, {
      cancelToken: this.requestSource.token,
    })
      .then(this.processResponse)
      .catch((error) => {
        this.processResponse(error.response);
      });

    if (staticContext && staticContext.fetching) {
      staticContext.fetching.push(request);
    }
  };

  processResponse = (response) => {
    const { endpoint } = this.props;

    if (this._unmounted || !endpoint) {
      return;
    }

    let games = [];

    if (
      response &&
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data.games) &&
      response.data.data.games.length > 0
    ) {
      const { staticContext } = this.props;
      let { isMobile } = this.props.appState.state;

      if (
        typeof staticContext === "object" &&
        typeof staticContext.isMobile === "boolean"
      ) {
        isMobile = staticContext.isMobile;
      }

      games = processGamesResponse(response.data.data.games, isMobile);
    }

    const { filter } = this.props;

    if (filter) {
      games = filter(games.slice(0));
    }

    const { staticContext } = this.props;

    if (staticContext && staticContext.responses) {
      staticContext.responses.gamesLoader[endpoint] = games;
    } else {
      responseCache[endpoint] = games;

      this.setState({
        loading: false,
        games,
      });
    }
  };

  handleErrorResponse = (error) => {
    if (axios.isCancel(error)) {
      return;
    }

    this.processResponse(error.response);
  };
}

export default withRouter(
  subscribeTo(
    {
      appState: AppStateContainer,
    },
    ApiGamesLoader
  )
);
