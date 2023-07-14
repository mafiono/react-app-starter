import React, { useEffect, useCallback, useState, useRef } from "react";
import { Typography, Paper, Grid, Button } from "@material-ui/core";
import { withRouter } from "react-router-dom";

import { LoadingIndicator } from ".";
import { apiFetch } from "../util";
import { MaxWidth, VerticalPadder } from "./styled";
import { AppStateContainer, PlayerContainer, subscribeTo } from "../state";

function ConfirmSignUp({ player, token, appState, history }) {
  const [signUpComplete, setSignUpComplete] = useState(undefined);

  const handleResponse = useCallback((response) => {
    if (!response || typeof response.data !== "object" || !response.data.info) {
      return;
    }

    const { info } = response.data;

    if (info.success) {
      setSignUpComplete(true);
    } else {
      setSignUpComplete(false);
    }
  }, []);

  const playerLoggedIn = player.loggedIn();

  useEffect(() => {
    if (!token || playerLoggedIn) {
      return;
    }

    apiFetch
      .post("register/complete/token", {
        data: {
          token,
        },
      })
      .then(handleResponse)
      .catch((error) => {
        handleResponse(error.response);
      });
  }, [handleResponse, playerLoggedIn, token]);

  const startedLoggedIn = useRef(playerLoggedIn);

  useEffect(() => {
    if (!startedLoggedIn.current && playerLoggedIn) {
      history.push("/");
    }
  }, [history, playerLoggedIn]);

  return (
    <MaxWidth>
      <VerticalPadder>
        <Paper elevation={1}>
          <VerticalPadder left={2} right={2}>
            <Typography variant="h6" align="center" component="p">
              Account confirmation
            </Typography>
            <VerticalPadder>
              {playerLoggedIn ? (
                <Typography
                  variant="body2"
                  align="center"
                  component="p"
                  color="error"
                >
                  You are currently logged in. Please log out to confirm your
                  account.
                </Typography>
              ) : !token ? (
                <Typography
                  variant="body2"
                  align="center"
                  component="p"
                  color="error"
                >
                  No token specified.
                </Typography>
              ) : (
                <>
                  {signUpComplete === undefined && (
                    <>
                      <Typography variant="body2" align="center" component="p">
                        In progress...
                      </Typography>
                      <VerticalPadder bottom={0}>
                        <LoadingIndicator />
                      </VerticalPadder>
                    </>
                  )}
                  {signUpComplete === false && (
                    <Typography
                      variant="body2"
                      align="center"
                      component="p"
                      color="error"
                    >
                      Account confirmation failed. Your token expired or it
                      doesn't exist.
                    </Typography>
                  )}
                  {signUpComplete === true && (
                    <Grid container spacing={8} justify="center">
                      <Grid item xs={12}>
                        <Typography
                          variant="subtitle1"
                          align="center"
                          component="p"
                        >
                          Account confirmation complete. You can now login.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={appState.showLogin}
                        >
                          Login
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                </>
              )}
            </VerticalPadder>
          </VerticalPadder>
        </Paper>
      </VerticalPadder>
    </MaxWidth>
  );
}

export default withRouter(
  subscribeTo(
    {
      appState: AppStateContainer,
      player: PlayerContainer,
    },
    ConfirmSignUp
  )
);
