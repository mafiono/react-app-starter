import React, { useReducer } from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import { Typography, Button } from "@material-ui/core";
import { default as PlayCircleOutlineIcon } from "@material-ui/icons/PlayCircleOutline";
import axios from "axios";
import { useInView } from "react-intersection-observer";

import { Game } from "../models/api";
import { LoadingIndicator } from ".";
import { Overlay, Spacer } from "../component/styled";
import { subscribeTo, PlayerContainer, AppStateContainer } from "../state";
import { apiFetch } from "../util";

import { newBadge } from "../img";

class GameGrid extends React.PureComponent {
  state = {
    activeId: undefined,
    activeUrl: undefined,
  };

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { games, loading, appState } = this.props;
    const { activeId, activeUrl } = this.state;
    const { isMobile } = appState.state;

    let content = null;

    if (Array.isArray(games)) {
      if (games.length === 0) {
        content = (
          <Spacer>
            <Typography variant="subtitle1" component="p" color="textSecondary">
              No games to display...
            </Typography>
          </Spacer>
        );
      } else {
        content = (
          <StyledGrid>
            {games.map((game) => {
              return (
                <GameListItem
                  key={game.id}
                  onClick={this.getClickHandler(game)}
                  game={game}
                  isMobile={isMobile}
                  active={activeId === game.id}
                  gameUrl={activeUrl}
                />
              );
            })}
          </StyledGrid>
        );
      }
    }

    return (
      <LoadingIndicator loadingMessage="Loading games..." active={loading}>
        {content}
      </LoadingIndicator>
    );
  }

  getClickHandler = (game) => () => {
    const { player } = this.props;
    const { activeId, activeUrl } = this.state;

    if (activeId === game.id && activeUrl) {
      return;
    }

    const { appState } = this.props;

    if (!player.loggedIn()) {
      appState.showLogin();

      return;
    }

    const { isMobile } = appState.state;

    if (!isMobile) {
      appState.setGameId(game.id);
      return;
    }

    this.setState(
      {
        activeId: game.id,
        activeUrl: undefined,
      },
      () => {
        if (this.gameRequestSource) {
          this.gameRequestSource.cancel();
        }

        this.gameRequestSource = axios.CancelToken.source();

        apiFetch(`player/game/${game.id}`, {
          cancelToken: this.gameRequestSource.token,
          params: {
            homeurl: "https://www.auslots.com/casino",
            cashierurl: "https://www.auslots.com/cashier",
          },
        })
          .then(this.handleResponse)
          .catch(this.handleError);
      }
    );
  };

  handleResponse = (response) => {
    if (this._unmounted) {
      return;
    }

    if (
      !response ||
      !response.data ||
      !response.data.data ||
      !response.data.data.url
    ) {
      this.setState({ activeUrl: null });

      return;
    }

    this.setState({ activeUrl: response.data.data.url });
  };

  handleError = (error) => {
    if (axios.isCancel(error)) {
      return;
    }

    this.handleResponse(error.response);
  };
}

const StyledGrid = styled.ol`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	justify-content: center;
	padding: 0;
	margin: 1em 0;

	${(p) => p.theme.mui.breakpoints.down("sm")} {
		margin-left: 0;
		margin-right: 0;
	}
`;

const GameListItem = React.memo(
  ({ game, isMobile, active, gameUrl, onClick }) => {
    let overlayContent = null;

    if (active) {
      if (gameUrl === undefined) {
        overlayContent = (
          <Typography key="loading">Preparing game...</Typography>
        );
      } else if (typeof gameUrl === "string" && gameUrl) {
        overlayContent = (
          <Button
            component="a"
            href={gameUrl}
            target="_blank"
            color="primary"
            variant="contained"
            size="small"
          >
            Start game
          </Button>
        );
      } else {
        overlayContent = (
          <Typography key="error">
            There was a problem while loading game data.
          </Typography>
        );
      }
    }

    return (
      <GameGridItem key={game.id} onClick={onClick}>
        <Overlay wrapper>
          <GameListImg2 game={game} isMobile={isMobile} />
          {game.isNew && <NewBadge src={newBadge} alt="" />}
          <HoverOverlay hide={active}>
            <Typography component="p" align="center">
              <PlayIcon />
            </Typography>
          </HoverOverlay>
          <Overlay active={active}>{overlayContent}</Overlay>
        </Overlay>
        <GameGridItemTitle component="p" aria-label="Game title" noWrap>
          <strong>{game.name}</strong>
        </GameGridItemTitle>
        <GameGridItemProvider
          variant="caption"
          component="p"
          aria-label="Game provider"
          noWrap
        >
          {game.providerName}
        </GameGridItemProvider>
      </GameGridItem>
    );
  }
);

const GameGridItem = styled.li`
	list-style-type: none;
	overflow: hidden;
	margin: .5em;
	position: relative;
	cursor: pointer;
	line-height: 0;
	min-height: 3.5em;
	width: ${(p) => p.theme.spacing(32.25)}px;

	${(p) => p.theme.mui.breakpoints.down("sm")} {
		width: ${(p) => p.theme.spacing(22.5)}px;
	}

	${(p) => p.theme.mui.breakpoints.down("xs")} {
		width: calc(50% - 1em);
		max-width: ${(p) => p.theme.spacing(22.5)}px;
	}
`;

const HoverOverlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
	transition: ${(p) => p.theme.createTransition("opacity", "shortest")};
	${(p) => (p.hide ? "transform: translateX(100%);" : "")}
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		opacity: 1;
	}
`;

const NewBadge = styled.img`
	position: absolute;
	top: 0;
	right: 0;
	width: auto;
	height: auto;
`;

const GameGridItemTitle = styled(Typography)`
	position: relative;
	padding: .5em .7em .2em;
	font-size: 1.2rem;

	${(p) => p.theme.mui.breakpoints.down("xs")} {
		font-size: 1.1rem;
	}
`;

const GameGridItemProvider = styled(Typography)`
	position: relative;
	margin-top: -.2em;
	padding: 0 .7em .2em;

	${(p) => p.theme.mui.breakpoints.down("xs")} {
		font-size: .9em;
	}
`;

const PlayIcon = styled(PlayCircleOutlineIcon)`
	font-size: 70px;
	filter: drop-shadow(0 0 .07em #000);
	color: #fff;
`;

const GameListImg2 = React.memo(({ game, isMobile }) => {
  const [error, setError] = useReducer((s) => true, false);

  const [observerRef, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const fallbackImg =
    process.env.REACT_APP_API_IMAGE_ROOT +
    (isMobile
      ? "/media/images/slots/small/default/default.png"
      : "/media/images/slots/small/default/jpg/default.jpg");

  const src = error
    ? fallbackImg
    : isMobile
    ? game.images.icon
    : game.images.filled;

  return (
    <>
      <noscript>
        <img alt={game.name} src={src} />
      </noscript>
      <GameImg
        ref={observerRef}
        style={{ width: "100%", height: "auto" }}
        alt={game.name}
        src={inView ? src : fallbackImg}
        onError={inView ? setError : undefined}
      />
    </>
  );
});

GameListImg2.propTypes = {
  isMobile: PropTypes.bool,
  game: PropTypes.instanceOf(Game),
};

const GameImg = styled.img`
	border-radius: .5em;
`;

export default subscribeTo(
  {
    player: PlayerContainer,
    appState: AppStateContainer,
  },
  GameGrid
);
