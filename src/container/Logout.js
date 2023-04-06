import React from "react";
import { Typography, Paper } from "@material-ui/core";

import { VerticalPadder, MaxWidth } from "../component/styled";
import { subscribeTo, PlayerContainer } from "../state";
import { ScrollTopOnMount } from "../component";

class Logout extends React.PureComponent {
  componentDidMount() {
    const { player } = this.props;

    if (!player.loggedIn()) {
      this.homeRedirect();
    }

    Promise.all([
      player.logout(),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]).then(this.homeRedirect);
  }

  render() {
    return (
      <VerticalPadder>
        <ScrollTopOnMount />
        <MaxWidth>
          <Paper>
            <VerticalPadder top={1} bottom={1} left={1} right={1}>
              <Typography align="center" component="p" variant="subtitle1">
                Logging you out...
              </Typography>
            </VerticalPadder>
          </Paper>
        </MaxWidth>
      </VerticalPadder>
    );
  }

  homeRedirect = () => window.location.replace("/");
}

export default subscribeTo(
  {
    player: PlayerContainer,
  },
  Logout
);
