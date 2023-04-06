import React from "react";
import PropTypes from "prop-types";

function filterOrReturn(filter, value) {
  if (typeof filter === "function") {
    value = filter(value);
  }

  return value;
}

class ControlledField extends React.PureComponent {
  static propTypes = {
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  state = {
    value: null,
  };

  constructor(props, filter) {
    super(props);

    this.state.filter = filter;
  }

  static getDerivedStateFromProps(props, state) {
    let { value: valueProp, defaultValue } = props;
    let returnedState = null;

    if (state.value === null) {
      valueProp = filterOrReturn(state.filter, valueProp);

      if (valueProp !== undefined) {
        returnedState = {
          value: valueProp,
        };
      } else {
        defaultValue = filterOrReturn(state.filter, defaultValue);

        if (defaultValue !== undefined) {
          returnedState = {
            value: defaultValue,
          };
        }
      }

      if (returnedState === null) {
        returnedState = {
          value: undefined,
        };
      }

      returnedState.lastValueProp = valueProp;
    } else if (valueProp !== state.lastValueProp) {
      returnedState = {
        value: filterOrReturn(state.filter, valueProp),
        lastValueProp: valueProp,
      };
    }

    return returnedState;
  }

  handleChange = (value) => {
    this.setState({ value }, this.runOnChange);
  };

  runOnChange = () => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(this.state.value);
    }
  };
}

export default ControlledField;
