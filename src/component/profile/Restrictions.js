import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import { withRouter } from "react-router-dom";
import { Button, Typography, Paper, Grid } from "@material-ui/core";

import { apiFetch, validatorFromApiFields, processApiFields } from "../../util";
import { subscribeTo, PlayerContainer } from "../../state";
import { LoadingIndicator, Form } from "..";
import { MaxWidth, VerticalPadder, GridContainer } from "../styled";
import { ApiFormFields } from "../api";

class RestrictionsForm extends React.PureComponent {
  static propTypes = {
    section: PropTypes.object.isRequired,
    onUpdate: PropTypes.func,
    customError: PropTypes.func,
  };

  state = {
    formError: undefined,
    submitting: false,
  };

  constructor(props) {
    super(props);

    const { fields } = props.section.form;

    this.validator = validatorFromApiFields(fields).instance;
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { submitting, formError } = this.state;
    const { fields } = this.props.section.form;

    return (
      <Form
        onSubmit={this.handleSubmit}
        validator={this.validator}
        submitting={submitting}
      >
        {(formState) => (
          <Form.FieldStateProvider
            center
            validator={this.validator}
            formState={formState}
            textFieldProps={{
              margin: "dense",
              fullWidth: true,
            }}
          >
            {(fieldStates) => (
              <GridContainer spacing={16} justify="center">
                <ApiFormFields
                  fieldStates={fieldStates}
                  fields={fields}
                  GridProps={{
                    xs: 12,
                    sm: 6,
                  }}
                />
                <Grid item xs={12}>
                  <VerticalPadder bottom={0} align="center">
                    {formError && (
                      <Typography
                        color="error"
                        component="p"
                        variant="caption"
                        paragraph
                      >
                        {formError}
                      </Typography>
                    )}
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!!formState.submitting}
                      size="small"
                    >
                      {formState.submitting ? "Processing..." : "Submit"}
                    </Button>
                  </VerticalPadder>
                </Grid>
              </GridContainer>
            )}
          </Form.FieldStateProvider>
        )}
      </Form>
    );
  }

  handleSubmit = (data) => {
    this.setState(
      {
        formError: undefined,
      },
      () => {
        const { form } = this.props.section;

        try {
          data = processApiFields(form.fields, data);
        } catch (ex) {
          this.setState({
            formError: ex.message,
          });
          return;
        }

        this.setState(
          {
            formError: undefined,
            submitting: true,
          },
          () => {
            const fetchMethod =
              form.method === "POST" ? apiFetch.post : apiFetch;

            fetchMethod(form.url, { data })
              .then(this.handleResponse)
              .catch((error) => this.handleResponse(error.response));
          }
        );
      }
    );
  };

  handleResponse = (response) => {
    if (this._unmounted) {
      return;
    }

    const { data, info } = response.data;

    this.setState({
      submitting: false,
    });

    if (!info.success) {
      let formError = undefined;

      const { customError } = this.props;

      if (customError) {
        formError = customError(response.data);
      } else if (data && data.message) {
        formError = data.message;
      } else {
        formError =
          "There were some problems with the action. Please contact support.";
      }

      this.setState({
        formError,
      });

      return;
    }

    const { onUpdate } = this.props;

    if (onUpdate) {
      onUpdate();
    }
  };
}

function RestrictionSection({ children, section, onUpdate, customError }) {
  return (
    <FullHeightPaper>
      <VerticalPadder left={2} right={2}>
        {children}
        <RestrictionsForm
          section={section}
          onUpdate={onUpdate}
          customError={customError}
        />
      </VerticalPadder>
    </FullHeightPaper>
  );
}

class Restrictions extends React.PureComponent {
  state = {
    restrictions: undefined,
  };

  componentDidMount() {
    this.fetch();
  }

  render() {
    return <VerticalPadder>{this.renderContent()}</VerticalPadder>;
  }

  renderContent() {
    const { restrictions } = this.state;

    if (restrictions === undefined) {
      return <LoadingIndicator />;
    }

    if (restrictions === null) {
      return (
        <MaxWidth>
          <Paper>
            <VerticalPadder>
              <Typography
                component="p"
                variant="subtitle1"
                gutterBottom
                align="center"
              >
                The restrictions information could not be accessed.
              </Typography>
              <Typography component="p" align="center">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={this.fetch}
                  size="small"
                >
                  Try again
                </Button>
              </Typography>
            </VerticalPadder>
          </Paper>
        </MaxWidth>
      );
    }

    const { player } = this.props.player.state;
    const { dailyDepositLimit, freezeAccount, deactivateAccount } =
      restrictions;

    return (
      <>
        <Grid container spacing={24} alignItems="stretch">
          <Grid item xs={12}>
            <RestrictionSection
              section={dailyDepositLimit}
              onUpdate={this.fetch}
            >
              <Typography component="p" variant="h6" gutterBottom>
                Deposit limit
              </Typography>
              <Typography gutterBottom>
                {dailyDepositLimit.maxDailyDepositLimit_text}
              </Typography>
              <Typography paragraph>
                Current daily limit:{" "}
                <strong>
                  {dailyDepositLimit.currentDailyDepositLimit}{" "}
                  {player.currencySymbol}
                </strong>
              </Typography>
              {dailyDepositLimit.currentDailyDepositLimitPending && (
                <Typography paragraph>
                  Pending daily limit:{" "}
                  <strong>
                    {dailyDepositLimit.currentDailyDepositLimitPending_text}
                  </strong>
                </Typography>
              )}
            </RestrictionSection>
          </Grid>
          <Grid item xs={12} md={6}>
            <RestrictionSection
              section={freezeAccount}
              onUpdate={this.doLogout}
              customError={this.postFreezeHandler}
            >
              <Typography component="p" variant="h6" gutterBottom>
                Account freezing
              </Typography>
              <Typography paragraph>
                Disable account login for a selected period of time.
              </Typography>
            </RestrictionSection>
          </Grid>
          <Grid item xs={12} md={6}>
            <RestrictionSection
              section={deactivateAccount}
              onUpdate={this.doLogout}
            >
              <Typography component="p" variant="h6" gutterBottom>
                Account deactivation
              </Typography>
              <Typography paragraph>
                Permanently deactivate your account. This action is NOT
                reversible, so please be sure you want to deactivate your
                account.
              </Typography>
            </RestrictionSection>
          </Grid>
        </Grid>
      </>
    );
  }

  fetch = () => {
    const { player } = this.props.player.state;

    this.setState({ restrictions: undefined }, () => {
      apiFetch(`player/limits/${player.id}`)
        .then((response) => {
          this.setState({ restrictions: response.data.data });
        })
        .catch(() => this.setState({ restrictions: null }));
    });
  };

  doLogout = () => {
    const { history } = this.props;

    history.push("/logout");
  };

  postFreezeHandler = (response) => {
    if (!response || !response.info) {
      return "Unknown error. Please contact support.";
    }

    const { resultCode } = response.info;

    if (resultCode === "invalid_input") {
      return "Your password is incorrect.";
    } else {
      return "Unknown response. Please contact support.";
    }
  };
}

const FullHeightPaper = styled(Paper)`
	height: 100%;
`;

export default withRouter(
  subscribeTo(
    {
      player: PlayerContainer,
    },
    Restrictions
  )
);
