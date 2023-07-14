import React from "react";
import { Link } from "react-router-dom";
import { Button, TextField, Grid, Typography, Paper } from "@material-ui/core";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Form, ScrollTopOnMount } from "../../component";
import { apiFetch, DataValidator, canonicalize } from "../../util";
import { VerticalPadder } from "../../component/styled";

class Contact extends React.PureComponent {
  constructor(props) {
    super(props);

    this.formValidator = new DataValidator({
      name: {
        validators: [
          "required:your full name",
          "minLength:2",
          "matchRegex:^[a-zA-Z ]+$:u",
        ],
        messages: [undefined, undefined, "Invalid characters detected."],
      },
      email: {
        validators: ["required:your email", "email"],
      },
      username: {
        validators: ["lengthBetween:4:20", "matchRegex:^[a-zA-Z0-9-_]+$:i"],
        messages: [
          undefined,
          "Invalid characters detected. You can use alphanumeric characters with the addition of - and _.",
        ],
      },
      text: {
        validators: ["required:your message"],
      },
    });

    this.state = {
      formError: undefined,
      responseErrors: undefined,
      contacted: false,
      submitting: false,
    };
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { responseErrors, contacted, submitting, formError } = this.state;
    const helmet = (
      <Helmet>
        <title>E-mail contact</title>
        <link
          key="canonical"
          rel="canonical"
          href={canonicalize("help/contact")}
        />
      </Helmet>
    );

    if (contacted) {
      return (
        <VerticalPadder>
          <Paper elevation={1}>
            <VerticalPadder>
              {helmet}
              <Typography
                variant="h6"
                component="p"
                color="primary"
                align="center"
                gutterBottom
              >
                E-mail sent successfully
              </Typography>
              <Typography component="p" align="center" paragraph>
                Thank you for contacting our e-mail support. We'll reply to you
                shortly.
              </Typography>
              <Grid container justify="center" alignItems="center" spacing={24}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/"
                  >
                    Home
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={this.showForm}>
                    Contact form
                  </Button>
                </Grid>
              </Grid>
            </VerticalPadder>
          </Paper>
        </VerticalPadder>
      );
    }

    return (
      <VerticalPadder>
        <ScrollTopOnMount />
        <Paper elevation={2}>
          <VerticalPadder>
            {helmet}
            <Title variant="h6" component="p" align="center">
              E-mail contact
            </Title>
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
                  {({ getTextFieldState }) => (
                    <>
                      <Grid container spacing={32}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="E-mail"
                            {...getTextFieldState("email")}
                          />
                          <TextField
                            label="Name"
                            {...getTextFieldState("name")}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Username"
                            {...getTextFieldState("username")}
                          />
                        </Grid>
                      </Grid>
                      <TextField
                        label="Message"
                        multiline
                        rows={8}
                        {...getTextFieldState("text")}
                      />
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
                          Send
                        </Button>
                      </ButtonWrapper>
                    </>
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
    this.setState(
      {
        formError: undefined,
        responseErrors: undefined,
        submitting: true,
      },
      () => {
        apiFetch
          .post("contact", {
            data,
          })
          .then((response) => {
            if (this._unmounted) {
              return;
            }

            this.setState({
              contacted: true,
              submitting: false,
            });
          })
          .catch((error) => {
            if (this._unmounted) {
              return;
            }

            this.setState({
              contacted: false,
              submitting: false,
            });
          });
      }
    );
  };

  showForm = () => {
    this.setState({ contacted: false });
  };
}

const Title = styled(Typography)`
	margin-bottom: ${(p) => p.theme.spacing(2)}px;
`;

const ButtonWrapper = styled(Typography)`
	margin-top: ${(p) => p.theme.spacing(2)}px;
`;

export default Contact;
