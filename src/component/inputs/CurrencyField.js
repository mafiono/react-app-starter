import React from "react";

import { NumberField } from ".";

class CurrencyField extends React.PureComponent {
  render() {
    return (
      <NumberField
        {...this.props}
        inputProps={{
          thousandSeparator: ",",
          decimalScale: 2,
          fixedDecimalScale: true,
          allowNegative: false,
          prefix: "€ ",
          type: "tel",
        }}
      />
    );
  }
}

export default CurrencyField;
