import React from "react";
import styled from "styled-components/macro";
import { Dialog, Grid, Fade } from "@material-ui/core";

import { withGame } from "../util";
import { Game } from "../component";
import LoadingIndicator from "./LoadingIndicator";

class GameOverlay extends React.PureComponent {
  state = {
    fullscreen: false,
  };

  render() {
    const { gameId, onClose } = this.props;

    return (
      <Dialog
        fullScreen
        open={!!gameId}
        onClose={onClose}
        TransitionComponent={Fade}
      >
        {this.renderContent()}
      </Dialog>
    );
  }

  renderContent() {
    const { game, onClose, gameId } = this.props;

    if (!gameId) {
      return <span />;
    }

    if (!game) {
      return (
        <Grid
          container
          alignItems="center"
          justify="center"
          style={{ height: "100%" }}
        >
          <LoadingIndicator />
        </Grid>
      );
    }

    const { fullscreen } = this.state;

    return (
      <GameBg image={game.images.background}>
        <PaddedWrapper fullscreen={fullscreen}>
          <Game
            game={game}
            onClose={onClose}
            setFullscreen={this.setFullscreen}
            fullscreen={fullscreen}
          />
        </PaddedWrapper>
      </GameBg>
    );
  }

  setFullscreen = (fullscreen) => {
    this.setState({ fullscreen });
  };
}

const GameBg = styled.div`
	width: 100%;
	height: 100%;
	background: no-repeat url(${(p) => p.image});
	background-size: 100% 100%;
	background-position: 0 0;
`;

const PaddedWrapper = styled.div`
	margin: 0 auto;
	padding: ${(p) => (p.fullscreen ? "0" : "0 5em")};
	width: 100%;
	height: 100%;
	${(p) => (p.fullscreen ? null : "max-width: 1400px;")}
	transition: all ease-out .2s
`;

export default withGame(GameOverlay);
