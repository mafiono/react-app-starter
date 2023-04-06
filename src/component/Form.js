import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";

import { DataValidator, getFormData } from "../util";

const FormWrapper = styled.div`
	max-width: ${(p) => p.maxWidth};
	${(p) => (p.center ? "margin: 0 auto;" : null)}
`;

class FieldStateProvider extends React.PureComponent {
  static propTypes = {
    children: PropTypes.func,
    formState: PropTypes.object,
    validator: PropTypes.instanceOf(DataValidator),
    textFieldProps: PropTypes.object,
    checkboxFieldProps: PropTypes.object,

    center: PropTypes.bool,
    maxWidth: PropTypes.string,
  };

  static defaultProps = {
    center: false,
    maxWidth: "80em",
  };

  constructor(props) {
    super(props);

    this.boundFunctions = {
      getTextFieldState: this.getTextFieldState,
      getCheckboxFieldState: this.getCheckboxFieldState,
    };
  }

  render() {
    const { children, center, maxWidth } = this.props;

    return (
      <FormWrapper center={center} maxWidth={maxWidth}>
        {children(this.boundFunctions)}
      </FormWrapper>
    );
  }

  getCommonFieldState = (name, additionalProps) => {
    const { formState } = this.props;

    const fieldState = Object.assign(
      {
        name: name + "",
        helperText: null,
        error: false,
        FormHelperTextProps: {
          component: "div",
        },
      },
      additionalProps
    );

    if (formState) {
      const messages = formState.messages || {};

      if (messages.hasOwnProperty(name)) {
        fieldState.helperText = messages[name].map((m, i) => (
          <p key={i}>{m}</p>
        ));
        fieldState.error = true;
      }

      if (!!formState.submitting) {
        fieldState.disabled = true;
      }
    }

    return fieldState;
  };

  getTextFieldState = (name) => {
    const fieldState = {
      required: false,
    };

    const { textFieldProps, validator } = this.props;

    if (validator) {
      if (validator.fieldRuleExists(name, "required")) {
        fieldState.required = true;
      }
    }

    return this.getCommonFieldState(
      name,
      Object.assign(fieldState, textFieldProps)
    );
  };

  getCheckboxFieldState = (name) => {
    const { checkboxFieldProps } = this.props;

    return this.getCommonFieldState(name, checkboxFieldProps);
  };
}

class Form extends React.PureComponent {
  static FieldStateProvider = FieldStateProvider;

  static propTypes = {
    children: PropTypes.func,
    onSubmit: PropTypes.func,
    onPreSubmit: PropTypes.func,
    validator: PropTypes.instanceOf(DataValidator),
    noValidate: PropTypes.bool,
    submitting: PropTypes.bool,
    messages: PropTypes.object,
  };

  static defaultProps = {
    noValidate: true,
    submitting: false,
  };

  constructor(props) {
    super(props);

    this.form = React.createRef();
    this.state = {
      messages: {},
    };
  }

  render() {
    const {
      children,
      noValidate,
      submitting,
      messages: messagesProp,
      validator,
    } = this.props;
    const messages =
      messagesProp !== undefined ? messagesProp : this.state.messages;

    return (
      <form
        ref={this.form}
        onSubmit={this.handleSubmit}
        noValidate={noValidate}
      >
        {children({ messages, submitting, validator })}
      </form>
    );
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { submitting } = this.props;

    if (submitting || this.form.current === null) {
      return;
    }

    const { validator, onSubmit, onPreSubmit } = this.props;
    let data = getFormData(this.form.current);

    if (onPreSubmit) {
      data = onPreSubmit(data);
    }

    let messages = {};

    if (validator) {
      messages = validator.validate(data);

      if (Object.keys(messages).length > 0) {
        this.setState({ messages });
        return;
      }
    }

    this.setState({ messages });
    if (onSubmit) {
      onSubmit(data);
    }
  };
}

export default Form;
