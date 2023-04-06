import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import styled from "styled-components/macro";
import { Typography, Button } from "@material-ui/core";
import axios from "axios";

import { apiFetch } from "../util";
import { processGamesResponse } from "../models/api";
import { LoadingIndicator } from ".";
import { Spacer } from "../component/styled";
import { AppStateContainer, subscribeTo, PlayerContainer } from "../state";

import { GameGrid } from ".";

function getFetchUrl(props, state) {
  const { categories, providers, perPage } = props;
  const { page } = state;

  let selectedProvider = "all";
  if (Array.isArray(providers) && providers.length > 0) {
    selectedProvider = providers.join(",");
  }

  let selectedCategory = "all";
  if (Array.isArray(categories) && categories.length > 0) {
    selectedCategory = categories.join(",");
  }

  return `games/filter/${selectedCategory}/${selectedProvider}/nosort/${perPage}/${
    page * perPage
  }`;
}

class GameList extends React.PureComponent {
  static propTypes = {
    perPage: PropTypes.number,
    providers: PropTypes.array,
    categories: PropTypes.array,
    hideLoadingTrigger: PropTypes.bool,
    filterGames: PropTypes.func,
  };

  static defaultProps = {
    perPage: parseInt(process.env.REACT_APP_GAMES_PER_PAGE, 10),
    hideLoadingTrigger: false,
    filterGames: null,
  };

  state = {
    games: undefined,
    loading: true,
    page: 0,
  };

  listRequestSource = null;
  gameRequestSource = null;

  static getDerivedStateFromProps(props, state) {
    const { staticContext } = props;

    if (staticContext) {
      const fetchUrl = getFetchUrl(props, state);

      if (staticContext.responses.gameList[fetchUrl]) {
        return {
          games: staticContext.responses.gameList[fetchUrl],
          loading: false,
        };
      }
    }

    return null;
  }

  constructor(props) {
    super(props);

    this.fetch();
  }

  componentDidUpdate(prevProps, prevState) {
    const { categories, providers, perPage } = this.props;
    const {
      categories: prevCategories,
      providers: prevProviders,
      perPage: prevPerPage,
    } = prevProps;
    const { page, loading } = this.state;
    const { page: prevPage } = prevState;

    if (
      categories !== prevCategories ||
      providers !== prevProviders ||
      perPage !== prevPerPage
    ) {
      this.setState({ page: 0, loading: true }, this.load);
    } else if (page !== prevPage && !loading) {
      this.load();
    }
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { games, loading } = this.state;
    const { hideLoadingTrigger, filterGames } = this.props;

    if (!Array.isArray(games)) {
      return (
        <Spacer>
          <LoadingIndicator />
        </Spacer>
      );
    }

    let content = null;
    if (games.length === 0) {
      content = (
        <Spacer>
          <Typography variant="subtitle1" component="p" color="textSecondary">
            No games to display...
          </Typography>
        </Spacer>
      );
    } else {
      let filteredGames = games;

      if (filterGames) {
        filteredGames = filterGames(filteredGames.slice(0));
      }

      content = (
        <>
          <GameGrid games={filteredGames} loading={false} />
          {!hideLoadingTrigger && (
            <FooterWrapper align="center">
              <Button
                variant="contained"
                color="primary"
                onClick={this.incrementPage}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load more..."}
              </Button>
            </FooterWrapper>
          )}
        </>
      );
    }

    return (
      <LoadingIndicator loadingMessage="Loading games..." active={loading}>
        {content}
      </LoadingIndicator>
    );
  }

  load = () => {
    this.setState(
      {
        loading: true,
      },
      this.fetch
    );
  };

  fetch = () => {
    const { staticContext } = this.props;

    if (staticContext && staticContext.secondRun) {
      return;
    }

    if (this.listRequestSource) {
      this.listRequestSource.cancel();
    }

    this.listRequestSource = axios.CancelToken.source();

    const request = apiFetch(getFetchUrl(this.props, this.state), {
      cancelToken: this.listRequestSource.token,
    })
      .then(this.handleResponse)
      .catch(this.handleError);

    if (staticContext && staticContext.fetching) {
      staticContext.fetching.push(request);
    }
  };

  handleResponse = (response) => {
    if (this._unmounted) {
      return;
    }

    let { games, page } = this.state;
    const { isMobile } = this.props.appState.state;

    games = page > 0 && Array.isArray(games) ? games.slice(0) : [];

    if (
      response &&
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data.games)
    ) {
      games = [
        ...games,
        ...processGamesResponse(response.data.data.games, isMobile),
      ];
    }

    const { staticContext } = this.props;

    if (staticContext && staticContext.responses) {
      staticContext.responses.gameList[getFetchUrl(this.props, this.state)] =
        games;
    } else {
      this.setState({
        loading: false,
        games,
      });
    }
  };

  handleError = (error) => {
    if (this._unmounted || axios.isCancel(error)) {
      return;
    }

    this.handleResponse(error.response);
  };

  incrementPage = () => {
    const { page } = this.state;
    this.setState({ page: page + 1 });
  };
}

const FooterWrapper = styled(Typography)`
	padding: 0 0 1em;
`;

export default withRouter(
  subscribeTo(
    {
      appState: AppStateContainer,
      player: PlayerContainer,
    },
    GameList
  )
);
