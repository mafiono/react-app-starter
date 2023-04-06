import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@material-ui/core";

import { GridContainer } from "../styled";
import { Form } from "../";
import { validatorFromApiFields, processApiFields, apiFetch } from "../../util";
import { ApiFormFields } from "../api";
import { ResponsiveImageContainer } from "../Carousel";

class PaymentBonus extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
    bonus: PropTypes.object.isRequired,
    onDeactivate: PropTypes.func.isRequired,
    onActivate: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      formError: undefined,
      lastBonus: props.bonus,
      formValidator: undefined,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { bonus: bonusProp } = props;
    let returnedState = null;

    if (state.lastBonus !== bonusProp) {
      returnedState = {
        lastBonus: bonusProp,
        formValidator: undefined,
      };

      if (
        bonusProp.form &&
        Array.isArray(bonusProp.form.fields) &&
        bonusProp.form.fields.length > 0
      ) {
        returnedState.formValidator = validatorFromApiFields(
          bonusProp.form.fields
        ).instance;
      }
    }

    return returnedState;
  }

  componentDidMount() {
    const { bonus } = this.props;

    if (
      bonus.form &&
      Array.isArray(bonus.form.fields) &&
      bonus.form.fields.length > 0
    ) {
      this.setState({
        formValidator: validatorFromApiFields(bonus.form.fields).instance,
      });
    }
  }

  render() {
    const { submitting } = this.props;
    const { formValidator } = this.state;

    return (
      <Grid item xs={12} sm={6} md={4}>
        <Form
          onSubmit={this.handleSubmit}
          validator={formValidator}
          submitting={submitting}
        >
          {this.renderFields}
        </Form>
      </Grid>
    );
  }

  renderFields = (formState) => {
    let formFields = null;
    const { formValidator, formError } = this.state;
    const { bonus, submitting } = this.props;

    if (formValidator !== undefined) {
      formFields = (
        <Form.FieldStateProvider
          validator={formValidator}
          formState={formState}
          textFieldProps={{
            margin: "dense",
          }}
        >
          {(fieldStates) => (
            <GridContainer spacing={16} justify="center">
              <ApiFormFields
                fieldStates={fieldStates}
                fields={bonus.form.fields}
                GridProps={{
                  xs: 12,
                }}
              />
            </GridContainer>
          )}
        </Form.FieldStateProvider>
      );
    }

    return (
      <>
        <Card>
          <BonusImage>
            <img
              alt={bonus.name}
              title={bonus.name}
              src={process.env.REACT_APP_API_IMAGE_ROOT + bonus.image}
            />
          </BonusImage>
          <CardContent>
            <Info>
              <Typography variant="subtitle1" noWrap>
                {bonus.name}
              </Typography>
              <Typography variant="caption" component="p">
                {bonus.text}
              </Typography>
              {formFields}
            </Info>
            <div>
              {formError && (
                <Typography
                  align="center"
                  color="error"
                  component="p"
                  variant="caption"
                >
                  {formError}
                </Typography>
              )}
            </div>
          </CardContent>
          <CardActionsCenter>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
            >
              {bonus.name === "No Thanks" ? "Skip bonus" : "Activate"}
            </Button>
          </CardActionsCenter>
        </Card>
      </>
    );
  };

  handleSubmit = (data) => {
    this.setState(
      {
        formError: undefined,
      },
      () => {
        const { bonus, onDeactivate, onActivate } = this.props;

        if (bonus.form.url === "/player/bonus/deactivate") {
          onDeactivate();

          return;
        }

        data.bonusId = bonus.bonusId;

        if (
          bonus.form &&
          Array.isArray(bonus.form.fields) &&
          bonus.form.fields.length > 0
        ) {
          try {
            data = processApiFields(bonus.form.fields, data);
          } catch (ex) {
            this.setState({
              formError: ex.message,
            });
            return;
          }
        }

        onActivate(data);
      }
    );
  };
}

const CardActionsCenter = styled(CardActions)`
	justify-content: center;
`;

class PaymentBonuses extends React.PureComponent {
  static propTypes = {
    bonuses: PropTypes.array.isRequired,
    onBonusSelected: PropTypes.func.isRequired,
  };

  state = {
    submitting: false,
    globalMessage: null,
  };

  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    const { bonuses } = this.props;
    const { submitting, globalMessage } = this.state;

    return (
      <GridContainer spacing={16}>
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            {globalMessage
              ? globalMessage
              : "Chose an optional bonus or skip them for this deposit."}
          </Typography>
        </Grid>
        {bonuses.map((bonus, index) => (
          <PaymentBonus
            key={index}
            bonus={bonus}
            index={index}
            submitting={submitting}
            onDeactivate={this.handleDeactivate}
            onActivate={this.handleActivate}
          />
        ))}
      </GridContainer>
    );
  }

  handleDeactivate = () => {
    if (this.state.submitting) {
      return;
    }

    const { onBonusSelected } = this.props;

    onBonusSelected(null);
  };

  handleActivate = (data) => {
    if (this.state.submitting) {
      return;
    }

    this.setState({
      submitting: true,
      globalMessage: "Activating bonus and continuing with deposit...",
    });

    apiFetch
      .post("player/bonus/activate", {
        data,
      })
      .then(this.handleResponse)
      .catch((error) => this.handleResponse(error.response));
  };

  handleResponse = (response) => {
    if (this._unmounted) {
      return;
    }

    this.setState({ submitting: false });

    if (response.data.info.success) {
      const { onBonusSelected } = this.props;
      const { message, name } = response.data.data;

      onBonusSelected({
        message,
        name,
      });

      return;
    }

    this.setState({
      globalMessage:
        "There was an error while setting the bonus. Please try again.",
    });
  };
}

const BonusImage = styled(ResponsiveImageContainer)`
	padding: 0 0 59.1836%;
`;

const Info = styled.div`
	flex-grow: 1;
	padding: 0 ${(p) => p.theme.spacing(2)}px;
	display: flex;
	flex-direction: column;
`;

export default PaymentBonuses;
