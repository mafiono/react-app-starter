import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import { CircularProgress, Button } from "@material-ui/core";

import { Game as GameModel } from "../models/api";
import { apiFetch } from "../util";
import { subscribeTo, PlayerContainer, AppStateContainer } from "../state";

class GameIframe extends React.PureComponent {
  static propTypes = {
    game: PropTypes.instanceOf(GameModel).isRequired,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    playForFun: PropTypes.bool,
    startPlayForFun: PropTypes.func,
  };

  static defaultProps = {
    playForFun: true,
    height: "100%",
  };

  constructor(props) {
    super(props);

    this.state = {
      gameUrl: null,
    };
  }

  componentDidMount() {
    this.loadGameUrl();
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  componentDidUpdate(prevProps) {
    const { playForFun: currentPlayForFun, game: currentGame } = this.props;

    if (
      prevProps.playForFun !== currentPlayForFun ||
      prevProps.game.id !== currentGame.id
    ) {
      this.loadGameUrl();
    }
  }

  render() {
    let { height, game } = this.props;

    if (typeof height === "number") {
      return height + "px";
    }

    const { playForFun, player, appState } = this.props;

    if (!playForFun && !player.state.player) {
      const { startPlayForFun } = this.props;

      return (
        <Wrapper key="pleaseLogin" height={height}>
          <div className="message">
            <p>Must be logged in to play</p>
            <p>
              <Button variant="contained" onClick={appState.showLogin}>
                Login
              </Button>
              {game.supportsPlayForFun && <span>or</span>}
              {game.supportsPlayForFun && (
                <Button variant="outlined" onClick={startPlayForFun}>
                  Play for fun
                </Button>
              )}
            </p>
          </div>
        </Wrapper>
      );
    }

    const { gameUrl } = this.state;

    if (gameUrl === null) {
      return (
        <Wrapper key="loading" height={height}>
          <CircularProgress />
        </Wrapper>
      );
    }

    if (appState.state.isMobile) {
      return (
        <Wrapper key="mobileStart" height={height}>
          <Button
            variant="contained"
            color="secondary"
            href={gameUrl}
            target="_blank"
          >
            Start game{playForFun ? " for fun" : null}
          </Button>
        </Wrapper>
      );
    }

    return <GameFrame src={gameUrl} allowFullScreen height={height} />;
  }

  loadGameUrl = () => {
    this.setState(
      {
        gameUrl: null,
      },
      () => {
        const { playForFun, game, player } = this.props;

        if (!player.state.player && playForFun === false) {
          return;
        }

        apiFetch("player/game/" + game.id, {
          params: {
            play_for_fun: playForFun,
          },
        }).then((response) => {
          if (this._unmounted) {
            return;
          }

          const { playForFun: currentPlayForFun, game: currentGame } =
            this.props;

          if (playForFun === currentPlayForFun && game.id === currentGame.id) {
            this.setState({ gameUrl: response.data.data.url });
          }
        });
      }
    );
  };
}

const Wrapper = styled.div`
	overflow: hidden;
	width: 100%;
	height: ${(p) => p.height};
	border: 0;
	padding: 0;
	margin: 0;
	display: flex;
	align-items: center;
	justify-content: center;

	> div.message {
		margin: 0 auto;
		padding: 1em;
		background: rgba(0, 0, 0, .5);
		text-align: center;
		border-radius: .5em;

		p {
			margin: 1em;
		}

		button {
			margin: 0 1em;
		}
	}
`;

const GameFrame = styled.iframe`
	overflow: hidden;
	position: relative;
	width: 100%;
	height: ${(p) => p.height};
	border: 0;
	padding: 0;
	margin: 0;
	background: #fff;
`;

export default subscribeTo(
  {
    player: PlayerContainer,
    appState: AppStateContainer,
  },
  GameIframe
);
