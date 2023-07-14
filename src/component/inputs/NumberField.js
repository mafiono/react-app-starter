import React from "react";
import { NumberFormatBase } from "react-number-format";
import { TextField } from "@material-ui/core";

import ControlledField from "./ControlledField";

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormatBase
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange(values.floatValue);
      }}
    />
  );
}

function filterProp(val) {
  const type = typeof val;
  let filtered = undefined;

  if (type === "string") {
    val = parseFloat(val, 10);
  } else if (type !== "number") {
    val = NaN;
  }

  if (!isNaN(val)) {
    filtered = val;
  }

  return filtered;
}

class NumberField extends ControlledField {
  constructor(props) {
    super(props, filterProp);
  }

  render() {
    let value = undefined;
    const { defaultValue, name, value: propsValue, ...baseProps } = this.props;

    if (this.props.hasOwnProperty("value")) {
      value = filterProp(propsValue);
    } else {
      const { value: stateValue } = this.state;

      value = stateValue;
    }

    return (
      <>
        {name && (
          <input
            type="hidden"
            name={name}
            value={value === undefined ? "" : value}
          />
        )}
        <TextField
          {...baseProps}
          value={value}
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
          name=""
          onChange={this.handleChange}
        />
      </>
    );
  }
}

export default NumberField;
