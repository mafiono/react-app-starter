import React from "react";
import { NavLink } from "react-router-dom";
import { Typography, Paper, Grid, Button } from "@material-ui/core";

import { subscribeTo, PlayerContainer, AppStateContainer } from "../../state";
import { VerticalPadder } from "../styled";

export default function isAuthorized(Component, options = {}) {
  const titleMessage = options.titleMessage
    ? options.titleMessage
    : "Unauthorized access";
  const contentMessage = options.contentMessage
    ? options.contentMessage
    : "Please login or create an account to continue";

  return subscribeTo(
    {
      player: PlayerContainer,
      appState: AppStateContainer,
    },
    function Gatekeeper(props) {
      const { player, appState } = props;
      const { loggedIn } = player;

      if (!loggedIn()) {
        return (
          <VerticalPadder>
            <Typography variant="h5" component="p" align="center" gutterBottom>
              {titleMessage}
            </Typography>
            <Paper>
              <VerticalPadder>
                <Grid container justify="center" spacing={24}>
                  <Grid item xs={12}>
                    <Typography align="center" gutterBottom>
                      {contentMessage}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button onClick={appState.showLogin} variant="contained">
                      Login
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      component={NavLink}
                      to="/sign-up"
                      color="primary"
                      variant="contained"
                    >
                      Sign up
                    </Button>
                  </Grid>
                </Grid>
              </VerticalPadder>
            </Paper>
          </VerticalPadder>
        );
      }

      return <Component {...props} />;
    }
  );
}
