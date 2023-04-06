import React from "react";
import PropTypes from "prop-types";
import { Grid, TextField } from "@material-ui/core";

import { NumberField, CurrencyField } from "../inputs";

function ApiFormFields(props) {
  const { fields, fieldStates, GridProps } = props;
  const { getTextFieldState } = fieldStates;

  return fields.map((field) => {
    let { fieldType } = field;

    if (fieldType === "hidden") {
      return null;
    }

    let fieldElement = null;
    const commonProps = {
      ...getTextFieldState(field.code),
      label: field.name,
    };

    if (field.hasOwnProperty("defaultValue")) {
      commonProps.defaultValue = field.defaultValue;
    }

    if (field.type === "number") {
      // "Neosurfvoucher" where f.type is number, but f.fieldType is string.
      fieldType = "number";
    }

    switch (fieldType) {
      case "string":
        const type =
          field.code && field.code.includes("password")
            ? "password"
            : undefined;

        fieldElement = <TextField {...commonProps} type={type} />;
        break;

      case "number":
      case "float":
        if (field.code.indexOf("amount") === -1) {
          fieldElement = <NumberField {...commonProps} />;
        } else {
          if (commonProps.hasOwnProperty("defaultValue")) {
            commonProps.defaultValue = parseFloat(commonProps.defaultValue, 10);

            if (
              isNaN(commonProps.defaultValue) ||
              commonProps.defaultValue <= 0
            ) {
              delete commonProps.defaultValue;
            }
          }

          fieldElement = <CurrencyField {...commonProps} />;
        }
        break;

      case "dropdown":
        const { options } = field;
        const optionValues = Object.keys(options);

        fieldElement = (
          <TextField
            {...commonProps}
            select
            SelectProps={{
              native: true,
            }}
          >
            <option key="__default" value={field.defaultValue}>
              {options.hasOwnProperty(field.defaultValue)
                ? options[field.defaultValue]
                : ""}
            </option>
            {optionValues.map((value) => (
              <option key={value} value={value}>
                {options[value]}
              </option>
            ))}
          </TextField>
        );
        break;

      case "date":
        fieldElement = (
          <TextField
            {...commonProps}
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        );
        break;

      default:
    }

    if (fieldElement === null) {
      // sentry error unknown field
      return null;
    }

    return (
      <Grid key={field.code} item {...GridProps}>
        {fieldElement}
      </Grid>
    );
  });
}

ApiFormFields.propTypes = {
  fields: PropTypes.array.isRequired,
  fieldStates: PropTypes.object.isRequired,
  GridProps: PropTypes.object.isRequired,
};

export default ApiFormFields;
