import React from "react";
import {
  Grid,
  Typography,
  Paper,
  Toolbar,
  TextField,
  Button,
} from "@material-ui/core";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { apiFetch, DataValidator } from "../../util";
import { subscribeTo, PlayerContainer } from "../../state";
import { countries } from "../../data";
import { Form } from "../../component";
import { ComposedCheckbox } from "../../component/inputs";
import { VerticalPadder } from "../../component/styled";

function StaticInfoItem(props) {
  return (
    <Grid container spacing={8}>
      <Grid item xs={4}>
        <Typography variant="body1" align="right">
          {props.label}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body1" noWrap>
          <strong>{props.value}</strong>
        </Typography>
      </Grid>
    </Grid>
  );
}

function StaticInformation({ player }) {
  const { username, fname, lname, email, birthdate } = player.state.player;

  return (
    <VerticalPadder left={1} right={1}>
      <Grid container spacing={24}>
        <Grid item xs={12} md={6}>
          <StaticInfoItem label="Username" value={username} />
          <StaticInfoItem label="Name" value={fname} />
          <StaticInfoItem label="Surname" value={lname} />
        </Grid>
        <Grid item xs={12} md={6}>
          <StaticInfoItem label="Email" value={email} />
          <StaticInfoItem label="Date of birth" value={birthdate} />
        </Grid>
      </Grid>
    </VerticalPadder>
  );
}

class ChangePassword extends React.PureComponent {
  constructor(props) {
    super(props);

    this.formValidator = new DataValidator({
      old_password: {
        validators: ["required:your current password", "minLength:8"],
      },
      new_password: {
        validators: ["required:your new password", "minLength:8"],
      },
      new_password_confirm: {
        validators: [
          "required:your new password",
          "sameAs:new_password:new password",
        ],
        messages: ["Please repeat your new password here."],
      },
    });

    this.state = {
      formError: undefined,
      showConfirmationMessage: false,
      submitting: false,
    };
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { formError, submitting, showConfirmationMessage } = this.state;

    return (
      <VerticalPadder left={2} right={2}>
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
                  <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Current password"
                        {...getTextFieldState("old_password")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="New password"
                        {...getTextFieldState("new_password")}
                      />
                      <TextField
                        label="Confirm new password"
                        {...getTextFieldState("new_password_confirm")}
                      />
                    </Grid>
                  </Grid>
                  {formError && (
                    <Typography paragraph align="center" color="error">
                      {formError}
                    </Typography>
                  )}
                  {showConfirmationMessage && (
                    <Typography paragraph align="center" color="primary">
                      Password changed successfully
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
                          ? "Changing password..."
                          : "Change password"}
                      </Button>
                    </Grid>
                  </Grid>
                </VerticalPadder>
              )}
            </Form.FieldStateProvider>
          )}
        </Form>
      </VerticalPadder>
    );
  }

  handleSubmit = (data) => {
    clearTimeout(this.confirmationTimeout);

    this.setState(
      {
        showConfirmationMessage: false,
        formError: undefined,
        submitting: true,
      },
      () => {
        delete data.new_password_confirm;

        apiFetch
          .post("player/changepass", {
            data,
          })
          .then((response) => {
            if (
              !response.hasOwnProperty("data") ||
              !response.data.hasOwnProperty("info") ||
              !response.data.info.success
            ) {
              this.handleFormError(response);
            } else {
              this.confirmationTimeout = setTimeout(
                () =>
                  !this._unmounted &&
                  this.setState({ showConfirmationMessage: false }),
                3000
              );

              this.setState({
                showConfirmationMessage: true,
                submitting: false,
                formError: undefined,
              });
            }
          })
          .catch((error) => {
            this.handleFormError(error.response);
          });
      }
    );
  };

  handleFormError = (response) => {
    let formError = undefined;

    if (
      response.hasOwnProperty("data") &&
      response.data.hasOwnProperty("info") &&
      response.data.info.resultCode === "invalid_old_password"
    ) {
      formError = "Your current password is incorrect.";
    } else {
      formError =
        "We're having trouble changing your password at the moment. Please try again later.";
    }

    this.setState({
      formError,
      submitting: false,
    });
  };
}

class ChangeSettings extends React.PureComponent {
  constructor(props) {
    super(props);

    this.formValidator = new DataValidator({
      fname: {
        validators: [
          "required:your first name",
          "minLength:2",
          "matchRegex:^[a-z]+(?:[\\s][a-z]+)*$:u",
        ],
        messages: [undefined, undefined, "Invalid characters detected."],
      },
      lname: {
        validators: [
          "required:your last name",
          "minLength:2",
          "matchRegex:^[a-z]+(?:[\\s][a-z]+)*$:u",
        ],
        messages: [undefined, undefined, "Invalid characters detected."],
      },
      countrycode: {
        validators: ["required:your country"],
      },
      birthdate: {
        validators: ["required:your birthday"],
      },
    });

    this.state = {
      formError: undefined,
      showConfirmationMessage: false,
      submitting: false,
    };
  }

  render() {
    const { formError, submitting, showConfirmationMessage } = this.state;
    const { player } = this.props.player.state;

    return (
      <VerticalPadder left={2} right={2}>
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
                fullWidth: true,
                helperText: <p>&nbsp;</p>,
              }}
            >
              {({ getTextFieldState, getCheckboxFieldState }) => (
                <div style={{ paddingBottom: "1em" }}>
                  <Grid container spacing={32}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="First name"
                        defaultValue={player.fname}
                        {...getTextFieldState("fname")}
                      />
                      <TextField
                        label="Last name"
                        defaultValue={player.lname}
                        {...getTextFieldState("lname")}
                      />
                      <TextField
                        label="Birthday"
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        defaultValue={player.birthdate}
                        {...getTextFieldState("birthdate")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Country"
                        select
                        SelectProps={{
                          native: true,
                        }}
                        defaultValue={player.countrycode}
                        {...getTextFieldState("countrycode")}
                      >
                        {countries.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                      <ComposedCheckbox
                        label="I would like to receive newsletters"
                        value=" "
                        startChecked={player.newsletter}
                        {...getCheckboxFieldState("newsletter")}
                      />
                    </Grid>
                  </Grid>
                  {formError && (
                    <Typography paragraph align="center" color="error">
                      {formError}
                    </Typography>
                  )}
                  {showConfirmationMessage && (
                    <Typography paragraph align="center" color="primary">
                      Settings saved
                    </Typography>
                  )}
                  <Typography align="center">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!!formState.submitting}
                    >
                      {formState.submitting
                        ? "Saving settings..."
                        : "Save settings"}
                    </Button>
                  </Typography>
                </div>
              )}
            </Form.FieldStateProvider>
          )}
        </Form>
      </VerticalPadder>
    );
  }

  handleSubmit = (data) => {
    clearTimeout(this.confirmationTimeout);

    this.setState(
      {
        showConfirmationMessage: false,
        formError: undefined,
        submitting: true,
      },
      () => {
        data.newsletter = data.newsletter === " ";

        apiFetch
          .post("player/update/long", {
            data,
          })
          .then((response) => {
            if (
              !response.hasOwnProperty("data") ||
              !response.data.hasOwnProperty("info") ||
              !response.data.info.success
            ) {
              this.handleFormError(response);
            } else {
              this.confirmationTimeout = setTimeout(
                () =>
                  !this._unmounted &&
                  this.setState({ showConfirmationMessage: false }),
                3000
              );

              const { setPlayer } = this.props;

              setPlayer(response.data.data);

              this.setState({
                showConfirmationMessage: true,
                submitting: false,
                formError: undefined,
              });
            }
          })
          .catch((error) => {
            this.handleFormError(error.response);
          });
      }
    );
  };

  handleFormError = (response) => {
    //Sentry error

    this.setState({
      formError:
        "We're having trouble saving settings at the moment. Please try again later.",
      submitting: false,
    });
  };
}

class Settings extends React.PureComponent {
  render() {
    const { player } = this.props;

    if (!player.loggedIn()) {
      return null;
    }

    return (
      <>
        <Helmet>
          <title>Profile settings</title>
        </Helmet>
        <SpacedPaper key="static">
          <StaticInformation player={player} />
        </SpacedPaper>
        <SpacedPaper key="settings">
          <Toolbar>
            <Typography variant="subtitle1" component="p">
              Change settings
            </Typography>
          </Toolbar>
          <ChangeSettings player={player} setPlayer={player.setPlayer} />
        </SpacedPaper>
        <SpacedPaper key="pass">
          <Toolbar>
            <Typography variant="subtitle1" component="p">
              Change password
            </Typography>
          </Toolbar>
          <ChangePassword />
        </SpacedPaper>
      </>
    );
  }
}

const SpacedPaper = styled(Paper)`
	margin-bottom: 2em;
`;

export default subscribeTo(
  {
    player: PlayerContainer,
  },
  Settings
);
