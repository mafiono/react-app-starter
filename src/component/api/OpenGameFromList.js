import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";

import { apiFetch } from "../../util";
import { subscribeTo, AppStateContainer } from "../../state";
import { Game } from "../../models/api";
import { LoadingIndicator, GameIframe } from "../.";

class OpenGameFromList extends React.PureComponent {
  static propTypes = {
    categories: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    providers: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    atIndex: PropTypes.number,
  };

  static defaultProps = {
    categories: "all",
    providers: "all",
    atIndex: 0,
  };

  state = {
    game: undefined,
  };

  componentDidMount() {
    this.loadProvider();
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { game } = this.state;

    if (game === null) {
      return (
        <>
          <Typography variant="h5" component="p" align="center" gutterBottom>
            Problems while loading game
          </Typography>
          <Typography align="center" gutterBottom>
            Ups, there was a problem getting the game data. Please try again in
            a moment.
          </Typography>
        </>
      );
    } else if (game === undefined) {
      return <LoadingIndicator />;
    }

    return <GameIframe game={game} playForFun={false} height="800px" />;
  }

  loadProvider = () => {
    this.extendedProviderHandler = this.getResponseHandler(
      this.handleProviderResponse
    );
    this.providerErrorHandler = this.getErrorHandler(
      this.extendedProviderHandler
    );

    const { categories, providers, atIndex } = this.props;

    let categoriesString =
      typeof categories === "string" ? categories : categories.join(",");
    let providersString =
      typeof providers === "string" ? providers : providers.join(",");

    apiFetch(
      `games/filter/${categoriesString}/${providersString}/nosort/${
        atIndex + 1
      }/0`
    )
      .then(this.extendedProviderHandler)
      .catch(this.providerErrorHandler);
  };

  getErrorHandler(responseHandler) {
    return (error) => {
      if (this._unmounted) {
        return;
      }

      responseHandler(error.response);
    };
  }

  getResponseHandler(responseHandler) {
    return (response) => {
      if (this._unmounted) {
        return;
      }

      if (
        !response ||
        !response.data ||
        !response.data.info ||
        !response.data.info.success
      ) {
        this.setState({ game: null });
        return;
      }

      responseHandler(response);
    };
  }

  handleProviderResponse = (response) => {
    const { atIndex } = this.props;

    if (
      !response.data ||
      !response.data.data ||
      !response.data.data.games ||
      !Array.isArray(response.data.data.games) ||
      response.data.data.games.length <= atIndex
    ) {
      this.setState({ game: null });
      return;
    }

    this.setState({ game: new Game(response.data.data.games[atIndex]) });
  };
}

export default subscribeTo(
  {
    appState: AppStateContainer,
  },
  OpenGameFromList
);
