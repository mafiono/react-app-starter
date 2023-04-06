import React from "react";
import { Link } from "react-router-dom";
import { Button, TextField, Grid, Typography, Paper } from "@material-ui/core";

import { Form } from ".";
import { apiFetch, DataValidator } from "../util";
import { VerticalPadder } from "./styled";
import { AppStateContainer, subscribeTo } from "../state";

class ResetPassword extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formError: undefined,
      submitting: false,
      screen: "initial",
    };

    this.formValidator = new DataValidator({
      password: {
        validators: ["required:your new password", "minLength:8"],
      },
      password_confirm: {
        validators: [
          "required:your new password",
          "sameAs:password:new password",
        ],
        messages: ["Please repeat your new password here."],
      },
    });
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { formError, submitting, screen } = this.state;

    return (
      <VerticalPadder left={2} right={2}>
        <Paper>
          <VerticalPadder>
            <Form
              onSubmit={this.handleSubmit}
              validator={this.formValidator}
              submitting={submitting}
            >
              {(formState) => (
                <Form.FieldStateProvider
                  center
                  formState={formState}
                  textFieldProps={{
                    fullWidth: false,
                    helperText: <p>&nbsp;</p>,
                    type: "password",
                  }}
                >
                  {({ getTextFieldState }) => (
                    <VerticalPadder>
                      <Typography component="h1" variant="h6" align="center">
                        Reset account password
                      </Typography>
                      <Grid container spacing={24} justify="center">
                        <Grid item>
                          <TextField
                            label="New password"
                            {...getTextFieldState("password")}
                          />
                        </Grid>
                        <Grid item>
                          <TextField
                            label="Confirm new password"
                            {...getTextFieldState("password_confirm")}
                          />
                        </Grid>
                      </Grid>
                      {formError && (
                        <Typography paragraph align="center" color="error">
                          {formError}
                        </Typography>
                      )}
                      {screen === "confirmation" && (
                        <Typography paragraph align="center" color="primary">
                          Password changed successfully. You can login now.
                        </Typography>
                      )}
                      {screen === "invalidToken" && (
                        <Grid container direction="column" alignItems="center">
                          <Grid item>
                            <Typography
                              paragraph
                              align="center"
                              color="primary"
                            >
                              Your reset token is invalid or has expired. You
                              can request a new one with the Forgott password
                              form.
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Button
                              color="primary"
                              variant="contained"
                              component={Link}
                              to="/password-recovery"
                            >
                              Request new reset token
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                      {screen !== "invalidToken" && (
                        <Grid container justify="center" spacing={8}>
                          <Grid item>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              disabled={!!formState.submitting}
                            >
                              {formState.submitting
                                ? "Changing password..."
                                : "Reset password"}
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                    </VerticalPadder>
                  )}
                </Form.FieldStateProvider>
              )}
            </Form>
          </VerticalPadder>
        </Paper>
      </VerticalPadder>
    );
  }

  handleSubmit = (data) => {
    data.token = this.props.token;

    this.setState(
      {
        formError: "",
        screen: "initial",
        submitting: true,
      },
      () => {
        apiFetch
          .post("player/resetPassword", {
            data,
          })
          .then(this.handleResponse)
          .catch((error) => {
            this.handleResponse(error.response);
          });
      }
    );
  };

  handleResponse = (response) => {
    if (this._unmounted) {
      return;
    }

    let formError = undefined;

    this.setState({
      submitting: false,
    });

    if (
      !response ||
      !response.hasOwnProperty("data") ||
      !response.data.hasOwnProperty("info")
    ) {
      this.setState({
        screen: "initial",
        formError: "Unexpected API error. Please contact support.",
      });

      return;
    }

    if (response.data.info.success) {
      this.setState({
        screen: "confirmation",
      });
    } else {
      const { resultCode } = response.data.info;

      switch (resultCode) {
        case "invalid_token":
          this.setState({
            screen: "invalidToken",
          });
          break;

        case "invalid_input":
          formError =
            "The password you specified is invalid. Please specify a password at with at least one uppercase letter, one lowercase letter and at least one number.";
          break;

        default:
          formError =
            "We're having trouble with password recovery at the moment. Please try again in a few...";
          break;
      }
    }

    if (formError) {
      this.setState({
        screen: "initial",
        formError,
      });
    }
  };
}

export default subscribeTo(
  {
    appState: AppStateContainer,
  },
  ResetPassword
);
