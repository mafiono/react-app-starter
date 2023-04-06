import React from "react";
import styled from "styled-components/macro";
import { Link } from "react-router-dom";
import {
  Button,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Dialog,
  Typography,
} from "@material-ui/core";

import { Form } from ".";
import { apiFetch } from "../util";
import {
  PlayerContainer,
  AppStateContainer,
  PlayerBalanceContainer,
  subscribeTo,
  BonusContainer,
  CashierMethodsContainer,
  PaymentWithdrawalsContainer,
} from "../state";

class Login extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formError: undefined,
      submitting: false,
      showCaptcha: false,
      captchaUrl: undefined,
    };

    this.rememberRef = React.createRef();
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { player, appState } = this.props;

    if (player.state.player) {
      return null;
    }

    const { formError, submitting, showCaptcha, captchaUrl } = this.state;

    return (
      <Dialog open={appState.state.showLogin} onClose={appState.hideLogin}>
        <DialogTitle>BetBTC Login</DialogTitle>
        <DialogContent>
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
                    <TextField
                      label="Username"
                      {...getTextFieldState("username")}
                    />
                    <TextField
                      type="password"
                      label="Password"
                      {...getTextFieldState("password")}
                    />
                    {showCaptcha && (
                      <Grid container spacing={8}>
                        <Grid
                          item
                          xs={12}
                          container
                          spacing={8}
                          alignItems="center"
                        >
                          <Grid item xs={12} sm={6}>
                            {captchaUrl && (
                              <img
                                src={captchaUrl}
                                alt="Captcha"
                                onClick={this.getCaptcha}
                              />
                            )}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Button onClick={this.getCaptcha}>
                              Regenerate code
                            </Button>
                          </Grid>
                        </Grid>
                        <Grid item container xs={12} justify="flex-end">
                          <TextField
                            label="Security code"
                            {...getTextFieldState("captcha")}
                          />
                        </Grid>
                      </Grid>
                    )}
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="yes"
                          color="primary"
                          inputRef={this.rememberRef}
                        />
                      }
                      label="Remember me"
                    />
                    {formError && (
                      <Typography align="center" color="error">
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
                          {formState.submitting ? "Checking..." : "Login"}
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="secondary"
                          disabled={!!formState.submitting}
                          onClick={appState.hideLogin}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                    <TopSpacer
                      align="center"
                      variant="caption"
                      color="textSecondary"
                      component="p"
                    >
                      Don't have an account?
                      <Button
                        variant="text"
                        component={Link}
                        to="/sign-up"
                        onClick={appState.hideLogin}
                        size="small"
                      >
                        Sign up
                      </Button>
                    </TopSpacer>
                    <TopSpacer
                      align="center"
                      variant="caption"
                      color="textSecondary"
                      component="p"
                    >
                      <Button
                        variant="text"
                        component={Link}
                        to="/password-recovery"
                        onClick={appState.hideLogin}
                        size="small"
                      >
                        Forgot your password?
                      </Button>
                    </TopSpacer>
                  </>
                )}
              </Form.FieldStateProvider>
            )}
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  handleSubmit = (data) => {
    let formError = undefined;

    if (!data.username || !data.password) {
      formError = "Please specify your username and password.";
    } else {
      if (this.state.showCaptcha && !data.captcha) {
        formError = "Please enter the security code.";
      }
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
          .post("player/login", {
            baseURL: "https://spa.betbtc.io/api/bog/v2_1_1/",
            data,
          })
          .then((response) => {
            if (this._unmounted) {
              return;
            }

            if (
              !response.hasOwnProperty("data") ||
              !response.data.hasOwnProperty("data") ||
              !response.data.hasOwnProperty("info") ||
              !response.data.info.success
            ) {
              return Promise.reject({ response });
            }

            this.setState({
              submitting: false,
            });

            const remember =
              this.rememberRef.current !== null
                ? this.rememberRef.current.checked
                : false;
            this.props.player.setPlayer(response.data.data, remember, () => {
              const {
                balance,
                bonuses,
                cashierMethods,
                appState,
                paymentWithdrawals,
              } = this.props;

              paymentWithdrawals.fetch();
              balance.fetch();
              appState.flashLoginMessage();
              bonuses.reset();
              cashierMethods.reset();
            });
          })
          .catch((error) => {
            if (this._unmounted) {
              return;
            }

            let formError = undefined;

            if (
              error.response.hasOwnProperty("data") &&
              error.response.data.hasOwnProperty("info")
            ) {
              const { resultCode } = error.response.data.info;

              switch (resultCode) {
                case "invalid_username_or_password":
                  formError = "Your username or password is incorrect.";
                  break;

                case "account_deactivated":
                  formError =
                    "Login impossible. This account has been deactivated. If you have any questions, please contact support.";
                  break;

                case "account_unactivated":
                  formError =
                    "You need to activate your account first. Please check your email for an activation link.";
                  break;

                case "invalid_captcha":
                  if (this.state.showCaptcha) {
                    formError = "Invalid security code.";
                  } else {
                    formError = "Please enter the security code.";
                  }
                  break;

                default:
                  formError = "Unexpected error. Please contact support";
              }
            } else {
              formError =
                "We're having trouble with user login at the moment. Please try again later.";
            }

            this.setState({
              formError,
              submitting: false,
            });

            if (
              error.response.hasOwnProperty("data") &&
              error.response.data.hasOwnProperty("data")
            ) {
              if (error.response.data.data.showCaptcha) {
                this.setState({
                  showCaptcha: true,
                });
              }
            }

            if (this.state.showCaptcha) {
              this.getCaptcha();
            }
          });
      }
    );
  };

  getCaptcha = () => {
    apiFetch
      .get("captcha?width=200&height=100")
      .then(this.handleCaptchaResponse)
      .catch((error) => this.handleCaptchaResponse(error.response));
  };

  handleCaptchaResponse = (response) => {
    if (
      this._unmounted ||
      !response ||
      !response.data ||
      !response.data.info ||
      !response.data.info.success
    ) {
      return;
    }

    this.setState({ captchaUrl: response.data.data.imgSrc });
  };
}

const TopSpacer = styled(Typography)`
	margin-top: ${(p) => p.theme.spacing()}px;
`;

export default subscribeTo(
  {
    player: PlayerContainer,
    appState: AppStateContainer,
    balance: PlayerBalanceContainer,
    bonuses: BonusContainer,
    cashierMethods: CashierMethodsContainer,
    paymentWithdrawals: PaymentWithdrawalsContainer,
  },
  Login
);
