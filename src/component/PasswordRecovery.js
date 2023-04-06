import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import { Button, TextField, Grid, Typography, Paper } from "@material-ui/core";

import { Form } from ".";
import { apiFetch, validateEmail } from "../util";
import { VerticalPadder } from "./styled";
import { AppStateContainer, subscribeTo } from "../state";

class PasswordRecovery extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formError: undefined,
      submitting: false,
      completePage: false,
    };
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { completePage } = this.state;

    if (completePage) {
      const { showLogin } = this.props.appState;

      return (
        <Paper>
          <VerticalPadder left={2} right={2}>
            <Typography variant="h6" align="center" component="p" paragraph>
              Email sent
            </Typography>
            <Typography align="center" component="p" paragraph>
              Please check your email inbox for further instructions.
            </Typography>
            <Grid container justify="center" spacing={8}>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/"
                >
                  BetBTC.IO Home
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={showLogin}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </VerticalPadder>
        </Paper>
      );
    }

    const { formError, submitting } = this.state;

    return (
      <Paper>
        <VerticalPadder left={2} right={2}>
          <Typography variant="h6" align="center" component="p" paragraph>
            Password recovery
          </Typography>
          <Form onSubmit={this.handleSubmit} submitting={submitting}>
            {(formState) => (
              <Form.FieldStateProvider
                center
                formState={formState}
                textFieldProps={{
                  margin: "dense",
                  fullWidth: true,
                }}
              >
                {({ getTextFieldState }) => (
                  <>
                    <Typography align="center" component="p" paragraph>
                      Please specify the email address for your account so we
                      can send you the password recovery information.
                    </Typography>
                    <FieldWrapper>
                      <TextField
                        label="Email"
                        {...getTextFieldState("email")}
                      />
                    </FieldWrapper>
                    {formError && (
                      <Typography align="center" color="error" paragraph>
                        {formError}
                      </Typography>
                    )}
                    <Grid container justify="center" spacing={8}>
                      <Grid item>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={!!formState.submitting}
                        >
                          {formState.submitting
                            ? "Sending recovery request..."
                            : "Send"}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="secondary"
                          component={Link}
                          to="/"
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
              </Form.FieldStateProvider>
            )}
          </Form>
        </VerticalPadder>
      </Paper>
    );
  }

  handleSubmit = (data) => {
    let formError = undefined;

    if (!data.email || !validateEmail(data.email)) {
      formError = "Please specify a valid email.";
    }

    this.setState(
      {
        formError,
        submitting: !formError,
      },
      () => {
        if (formError) {
          return;
        }

        apiFetch
          .post("player/forgottenpass", {
            data,
          })
          .then((response) => {
            if (this._unmounted) {
              return;
            }

            let formError = undefined;

            if (
              !response.hasOwnProperty("data") ||
              !response.data.hasOwnProperty("info") ||
              !response.data.info.success
            ) {
              formError =
                "We're having trouble with password recovery at the moment. Please try again in a moment.";
            }

            this.setState({
              submitting: false,
              completePage: !formError,
              formError,
            });
          })
          .catch((error) => {
            if (this._unmounted) {
              return;
            }

            let formError = undefined;

            if (
              error.response.hasOwnProperty("data") &&
              error.response.data.hasOwnProperty("info") &&
              error.response.data.info.resultCode === "player_not_found"
            ) {
              formError = "No player with the specified e-mail address exists.";
            } else {
              formError =
                "We're having trouble with password recovery at the moment. Please try again in a moment.";
            }

            this.setState({
              formError,
              submitting: false,
            });
          });
      }
    );
  };
}

const FieldWrapper = styled.div`
	width: 100%;
	max-width: ${(p) => p.theme.spacing(50)}px;
	margin: 0 auto ${(p) => p.theme.spacing(2)}px;
`;

export default subscribeTo(
  {
    appState: AppStateContainer,
  },
  PasswordRecovery
);
