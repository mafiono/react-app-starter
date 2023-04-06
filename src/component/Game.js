import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import {
  Grid,
  Typography,
  IconButton,
  Collapse,
  Button,
} from "@material-ui/core";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import FullscreenRoundedIcon from "@material-ui/icons/FullscreenRounded";
import FullscreenExitRoundedIcon from "@material-ui/icons/FullscreenExitRounded";

import { Game as GameModel } from "../models/api";
import { GameIframe } from "../component";

class Game extends React.PureComponent {
  static propTypes = {
    game: PropTypes.instanceOf(GameModel).isRequired,
    onClose: PropTypes.func,
    setFullscreen: PropTypes.func,
    ratio: PropTypes.number,
    fullscreen: PropTypes.bool,
  };

  static defaultProps = {
    ratio: 16 / 9,
    fullscreen: false,
  };

  constructor(props) {
    super(props);

    this.resizeDelayTimeout = null;
    this.wrapper = React.createRef();

    this.state = {
      width: 0,
      playForFun: false,
      showDetails: true,
    };
  }

  componentDidMount() {
    this.updateWidth();

    window.addEventListener("resize", this.handleWindowResize);
  }

  componentDidUpdate(prevProps) {
    const { game: currentGame, setFullscreen } = this.props;

    if (prevProps.game.id !== currentGame.id) {
      this.setState({ playForFun: null });

      if (setFullscreen) {
        setFullscreen(false);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  render() {
    const { game, onClose, ratio, setFullscreen, fullscreen } = this.props;
    const { width, playForFun, showDetails } = this.state;
    const { details } = game;

    const height = Math.round(width * (1 / ratio));

    return (
      <Wrapper fullscreen={fullscreen}>
        {!fullscreen && (
          <div>
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={3}>
                <ShadowText noWrap variant="h6" align="center">
                  {game.name}
                </ShadowText>
              </Grid>
              <GameActions item xs={7}>
                {false && (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={this.startPlay}
                    disabled={playForFun === false}
                  >
                    Play
                  </Button>
                )}
                {false && game.supportsPlayForFun && (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={this.startPlayForFun}
                    disabled={playForFun === true}
                  >
                    Play for fun
                  </Button>
                )}
                <Button
                  color="primary"
                  variant="contained"
                  onClick={onClose}
                  component={Link}
                  to="/cashier"
                >
                  Deposit
                </Button>
              </GameActions>
              <Grid item xs={2} style={{ textAlign: "center" }}>
                {setFullscreen && (
                  <IconButton
                    aria-label="Show fullscreen"
                    onClick={this.handleFullscreen}
                  >
                    <FullscreenRoundedIcon />
                  </IconButton>
                )}
                <IconButton aria-label="Close" onClick={onClose}>
                  <CloseRoundedIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Collapse in={showDetails}>
              <DetailsWrapper container spacing={8} alignItems="center">
                <Grid item xs={game.description.en ? 4 : undefined}>
                  <DetailsShadowText
                    align="right"
                    component="div"
                    color="textSecondary"
                  >
                    <Typography component="p">
                      <span>
                        Reels: <strong>{details.reels}</strong>
                      </span>
                      {game.providerName && (
                        <span>
                          Provider: <strong>{game.providerName}</strong>
                        </span>
                      )}
                      <span>
                        Lines: <strong>{details.lines}</strong>
                      </span>
                      <span>
                        Freespin:{" "}
                        <strong>
                          {game.freeRoundsSupported ? "Yes" : "No"}
                        </strong>
                      </span>
                    </Typography>
                  </DetailsShadowText>
                </Grid>
              </DetailsWrapper>
            </Collapse>
          </div>
        )}
        <GameFrameWrapper ref={this.wrapper} fullscreen={fullscreen}>
          <GameWrapper
            height={height}
            background={game.images.preview}
            fullscreen={fullscreen}
          >
            {playForFun !== null && (
              <GameIframe
                game={game}
                playForFun={playForFun}
                startPlayForFun={this.startPlayForFun}
              />
            )}
          </GameWrapper>
          {this.renderFullscreenButtons()}
        </GameFrameWrapper>
      </Wrapper>
    );
  }

  renderFullscreenButtons() {
    const { setFullscreen, fullscreen, onClose } = this.props;

    if (!fullscreen) {
      return null;
    }

    return (
      <>
        <IconButton
          className="fullscreenButtons"
          key="close"
          aria-label="Close"
          onClick={onClose}
        >
          <CloseRoundedIcon />
        </IconButton>
        {setFullscreen && (
          <IconButton
            className="fullscreenButtons fullscreen"
            key="exitFullscreen"
            aria-label="Close fullscreen"
            onClick={this.handleFullscreen}
          >
            <FullscreenExitRoundedIcon />
          </IconButton>
        )}
      </>
    );
  }

  noWrapper = () => {
    return !this.wrapper.current;
  };

  handleWindowResize = () => {
    if (this.noWrapper()) {
      return;
    }

    if (this.resizeDelayTimeout) {
      clearTimeout(this.resizeDelayTimeout);
    }

    this.resizeDelayTimeout = setTimeout(this.updateWidth, 166);
  };

  updateWidth = () => {
    if (this.noWrapper()) {
      return;
    }

    this.setState({ width: this.wrapper.current.clientWidth }, () => {
      setTimeout(this.updateWidth, 350);
    });
  };

  handleFullscreen = () => {
    const { setFullscreen, fullscreen } = this.props;

    if (setFullscreen) {
      setFullscreen(!fullscreen);
    }
  };

  toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };

  startPlay = () => {
    this.setState({ playForFun: false });
  };

  startPlayForFun = () => {
    this.setState({ playForFun: true });
  };
}

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	padding-top: ${(p) => (p.fullscreen ? "0" : "2em")};
	transition: all .2s ease-out;
`;

const GameFrameWrapper = styled.div`
	border: ${(p) => (p.fullscreen ? "0" : "1em solid rgba(0, 0, 0, .8)")};
	background: ${(p) => (p.fullscreen ? "transparent" : "rgba(0, 0, 0, .8)")};
	border-radius: ${(p) => (p.fullscreen ? "0" : ".3em")};
	margin: ${(p) => (p.fullscreen ? "0" : "1em 0 0")};
	transition: all .2s ease-out;
	width: 100%;
	box-shadow: ${(p) => (p.fullscreen ? "0" : "0 0 .5em rgba(255, 255, 255, .5)")};
	${(p) => (p.fullscreen ? "height: 100%;" : null)}
	position: relative;

	button.fullscreenButtons {
		position: absolute;
		top: .5em;
		right: .5em;
	}

	button.fullscreenButtons.fullscreen {
		top: 2.7em;
	}

	button.fullscreenButtons svg {
		filter: drop-shadow(0 0 2px rgba(0, 0, 0, .7));
	}
`;

const GameWrapper = styled.div`
	background: no-repeat center center url(${(p) => p.background});
	background-size: 100% 100%;
	height: ${(p) => p.height}px;
	width: 100%;
	transition: height .2s ease-out;

	${(p) => {
    if (!p.fullscreen) {
      return null;
    }

    return `
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
		`;
  }}
`;

const GameActions = styled(Grid)`
	text-align: center;

	button {
		margin: 0 .5em;
	}
`;

const ShadowText = styled(Typography)`
	text-shadow: 0 0 .2em rgba(0, 0, 0, .8);
`;

const DetailsShadowText = styled(ShadowText)`
	span {
		display: inline-block;
		margin: 0 1em 0 0;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	& > p {
		margin: 0;
	}
`;

const DetailsWrapper = styled(Grid)`
	margin-top: 1em;

	strong {
		color: #fff;
	}
`;

export default Game;
