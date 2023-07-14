import React from "react";
import { Button, TextField, Grid, Typography, Paper } from "@material-ui/core";
import styled from "styled-components/macro";
import { Link, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { Form, ScrollTopOnMount } from "../component";
import { apiFetch, DataValidator, canonicalize } from "../util";
import { subscribeTo, AppStateContainer, PlayerContainer } from "../state";
import { ComposedCheckbox, DateField } from "../component/inputs";
import { VerticalPadder } from "../component/styled";
import { countries } from "../data";

class SignUp extends React.PureComponent {
  constructor(props) {
    super(props);

    this.formValidator = new DataValidator({
      fname: {
        validators: [
          "required:your first name",
          "minLength:2",
          "matchRegex:^[a-z ,.'-]+$:ui",
        ],
        messages: [undefined, undefined, "Invalid characters detected."],
      },
      lname: {
        validators: [
          "required:your last name",
          "minLength:2",
          "matchRegex:^[a-z ,.'-]+$:ui",
        ],
        messages: [undefined, undefined, "Invalid characters detected."],
      },
      email: {
        validators: ["required:your email", "email"],
      },
      username: {
        validators: [
          "required:your username",
          "lengthBetween:4:20",
          "matchRegex:^[a-zA-Z0-9-_]+$:i",
        ],
        messages: [
          undefined,
          undefined,
          "Invalid characters detected. You can use alphanumeric characters with the addition of - and _.",
        ],
      },
      password: {
        validators: ["required:your password", "minLength:6"],
      },
      password_confirm: {
        validators: ["required:your password", "sameAs:password:password"],
        messages: ["Please repeat your password here."],
      },
      terms: {
        validators: ["required"],
        messages: ["You must agree to the terms."],
      },
      phone: {
        validators: [
          "required:your phone number",
          "lengthBetween:7:14",
          "matchRegex:^\\d+$",
        ],
        messages: [
          undefined,
          "Please specify a phone number between 7 and 14 digits.",
          "Please specify a valid phone number.",
        ],
      },
      birthdate: {
        validators: ["required:your birthday"],
      },
      countrycode: {
        validators: ["required:your country"],
      },
      address: {
        validators: ["required:your address"],
      },
      city: {
        validators: ["required:your city"],
      },
      zip: {
        validators: ["required:your ZIP code"],
      },
    });

    this.state = {
      formError: undefined,
      responseErrors: undefined,
      registeredPlayer: null,
      submitting: false,
      captchaUrl: null,
    };
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { appState } = this.props;
    const { loggedIn } = this.props.player;
    const {
      responseErrors,
      registeredPlayer,
      submitting,
      formError,
      captchaUrl,
    } = this.state;

    if (loggedIn()) {
      return <Redirect to="/" />;
    }

    if (registeredPlayer !== null) {
      return (
        <VerticalPadder>
          <ScrollTopOnMount />
          <Helmet>
            <title>Sign up successful</title>
          </Helmet>
          <Paper elevation={1}>
            <VerticalPadder>
              <Typography
                variant="h5"
                component="p"
                color="primary"
                align="center"
                gutterBottom
              >
                Account registered successfully
              </Typography>
              <Typography align="center" paragraph>
                Great {registeredPlayer.username}! You have successfully created
                your account. Please log in now.
              </Typography>
              <Typography align="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={appState.showLogin}
                  component={Link}
                  to="/"
                >
                  Login
                </Button>
              </Typography>
            </VerticalPadder>
          </Paper>
        </VerticalPadder>
      );
    }

    const refCodeParam = this.props.match.params.refCode;

    return (
      <VerticalPadder>
        <Helmet>
          <title>Sign up</title>
          <link
            rel="canonical"
            href={canonicalize(
              `sign-up${
                refCodeParam ? "/" + encodeURIComponent(refCodeParam) : ""
              }`
            )}
          />
        </Helmet>
        <Paper elevation={2}>
          <VerticalPadder>
            <Title variant="h6" align="center">
              Sign up with BetBTC.IO
            </Title>
            <VerticalPadder left={2} right={2}>
              <Form
                onSubmit={this.handleSubmit}
                validator={this.formValidator}
                submitting={submitting}
                messages={responseErrors}
              >
                {(formState) => (
                  <Form.FieldStateProvider
                    center
                    validator={this.formValidator}
                    formState={formState}
                    textFieldProps={{
                      fullWidth: true,
                      helperText: <p>&nbsp;</p>,
                    }}
                  >
                    {({ getTextFieldState, getCheckboxFieldState }) => (
                      <>
                        {appState.state.aAid && appState.state.aBid && (
                          <>
                            <input
                              type="hidden"
                              name="a_aid"
                              value={appState.state.aAid}
                            />
                            <input
                              type="hidden"
                              name="a_bid"
                              value={appState.state.aBid}
                            />
                          </>
                        )}
                        <Grid container spacing={32}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Email"
                              inputProps={{ tabIndex: "1" }}
                              {...getTextFieldState("email")}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Username"
                              inputProps={{ tabIndex: "2" }}
                              {...getTextFieldState("username")}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Password"
                              inputProps={{ tabIndex: "3" }}
                              type="password"
                              {...getTextFieldState("password")}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Confirm password"
                              inputProps={{ tabIndex: "4" }}
                              type="password"
                              {...getTextFieldState("password_confirm")}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="First name"
                              inputProps={{ tabIndex: "5" }}
                              {...getTextFieldState("fname")}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Last name"
                              inputProps={{ tabIndex: "6" }}
                              {...getTextFieldState("lname")}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <DateField
                              label="Birthday"
                              inputProps={{ tabIndex: "7" }}
                              {...getTextFieldState("birthdate")}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Phone"
                              InputProps={{ startAdornment: "+" }}
                              inputProps={{ tabIndex: "8" }}
                              {...getTextFieldState("phone")}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Country"
                              select
                              SelectProps={{
                                native: true,
                              }}
                              inputProps={{ tabIndex: "9" }}
                              {...getTextFieldState("countrycode")}
                            >
                              {countries.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Address"
                              inputProps={{ tabIndex: "10" }}
                              {...getTextFieldState("address")}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="City"
                              inputProps={{ tabIndex: "11" }}
                              {...getTextFieldState("city")}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="ZIP"
                              inputProps={{ tabIndex: "12" }}
                              {...getTextFieldState("zip")}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <ComposedCheckbox
                              CheckboxProps={{
                                inputProps: {
                                  tabIndex: "13",
                                },
                              }}
                              label={
                                <span>
                                  I accept the{" "}
                                  <a
                                    className="standard"
                                    target="_blank"
                                    href="/help/terms-and-conditions"
                                  >
                                    terms and conditions
                                  </a>{" "}
                                  and{" "}
                                  <a
                                    className="standard"
                                    target="_blank"
                                    href="/help/privacy-policy"
                                  >
                                    privacy policy
                                  </a>
                                </span>
                              }
                              value=" "
                              {...getCheckboxFieldState("terms")}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <ComposedCheckbox
                              CheckboxProps={{
                                inputProps: {
                                  tabIndex: "14",
                                },
                              }}
                              label="I would like to receive newsletters"
                              value=" "
                              startChecked
                              {...getCheckboxFieldState("newsletter")}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            {captchaUrl && (
                              <Grid container spacing={8}>
                                <Grid
                                  item
                                  container
                                  xs={12}
                                  sm={6}
                                  justify="flex-end"
                                >
                                  <TextField
                                    label="Captcha"
                                    inputProps={{ tabIndex: "15" }}
                                    {...getTextFieldState("captcha")}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <img src={captchaUrl} alt="Captcha" />
                                </Grid>
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                        {formError && (
                          <Typography align="center" color="error">
                            {formError}
                          </Typography>
                        )}
                        <ButtonWrapper align="center">
                          <Button
                            type="submit"
                            disabled={formState.submitting}
                            variant="contained"
                            color="primary"
                          >
                            Register account
                          </Button>
                        </ButtonWrapper>
                      </>
                    )}
                  </Form.FieldStateProvider>
                )}
              </Form>
            </VerticalPadder>
          </VerticalPadder>
        </Paper>
      </VerticalPadder>
    );
  }

  componentDidMount() {
    this.fetchCaptcha();
  }

  fetchCaptcha() {
    apiFetch
      .get("captcha?width=200&height=100")
      .then(this.handleCaptchaResponse)
      .catch((error) => this.handleCaptchaResponse(error.response));
  }

  handleSubmit = (data) => {
    this.setState(
      {
        formError: undefined,
        responseErrors: undefined,
        submitting: true,
      },
      () => {
        const refCodeParam = this.props.match.params.refCode;

        const requestData = { ...data };
        requestData.terms = data.terms === " " ? 1 : 0;
        requestData.newsletter = data.newsletter === " ";
        requestData.currencycode = "EUR";
        requestData.ref_code = refCodeParam || "7f6797ef";
        requestData.nickname = data.username;
        requestData.phone = "+" + data.phone;

        apiFetch
          .post("register/long", {
            data: requestData,
          })
          .then((response) => {
            if (this._unmounted) {
              return;
            }

            this.setState({
              registeredPlayer: response.data.data,
              submitting: false,
            });
          })
          .catch((error) => {
            if (this._unmounted) {
              return;
            }

            this.fetchCaptcha();

            const responseErrors = {};

            if (
              error.response.hasOwnProperty("data") &&
              error.response.data.hasOwnProperty("info") &&
              error.response.data.info.resultCode === "invalid_input"
            ) {
              for (const [
                ,
                { code: field, validators },
              ] of error.response.data.data.fields.entries()) {
                for (const [, { key: errorKey }] of validators.entries()) {
                  switch (field + ":" + errorKey) {
                    case "username:uniqueUsername":
                      responseErrors.username = ["Username is taken."];
                      break;

                    case "email:uniqueEmail":
                      responseErrors.email = [
                        "An account was already registered with this email.",
                      ];
                      break;

                    case "birthdate:validIsAdult":
                      responseErrors.birthdate = [
                        "You have to be an adult to register.",
                      ];
                      break;

                    case "captcha:validCaptcha":
                      responseErrors.captcha = ["Incorrect. Please try again."];
                      break;

                    default:
                      responseErrors[field] = [
                        "There's an unknown error for this field, but we're trying to fix it. Please try again soon.",
                      ];
                      break;
                  }
                }
              }

              this.setState({ responseErrors });
            } else {
              this.setState({
                formError:
                  "We're having trouble with account creation at the moment. Please try again later.",
              });
            }

            this.setState({ submitting: false });
          });
      }
    );
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

const Title = styled(Typography)`
	margin-bottom: ${(p) => p.theme.spacing(2)}px;
`;

const ButtonWrapper = styled(Typography)`
	margin-top: ${(p) => p.theme.spacing(2)}px;
`;

export default subscribeTo(
  {
    appState: AppStateContainer,
    player: PlayerContainer,
  },
  SignUp
);
