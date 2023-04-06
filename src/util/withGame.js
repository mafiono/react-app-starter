import React from "react";

import { apiFetch } from "../util";
import { Game } from "../models/api";

export default function withGame(Component) {
  return class extends React.PureComponent {
    constructor(props) {
      super(props);

      this.state = {
        game: null,
      };
    }

    componentDidMount() {
      this.getInfo();
    }

    componentDidUpdate(prevProps) {
      const { gameId: prevGameId } = prevProps;
      const { gameId } = this.props;

      if (prevGameId !== gameId) {
        this.getInfo();
      }
    }

    componentWillUnmount() {
      this._unmounted = true;
    }

    render() {
      return <Component {...this.props} game={this.state.game} />;
    }

    getInfo() {
      const { gameId } = this.props;
      let game = undefined;

      if (gameId) {
        apiFetch("games/" + gameId).then((response) => {
          if (this._unmounted || gameId !== this.props.gameId) {
            return;
          }

          this.setState({ game: new Game(response.data.data.games) });
        });
        // sentry error when game info doesn't load
      }

      this.setState({ game });
    }
  };
}
