import React from "react";

class HiddenField extends React.PureComponent {
  static nextFieldIndex = 0;
  fieldId = null;

  constructor(props) {
    super(props);

    this.fieldId = "input_hf" + HiddenField.nextFieldIndex++;
  }

  render() {
    const { name, value } = this.props;

    return <input type="hidden" id={this.fieldId} name={name} value={value} />;
  }
}

export default HiddenField;
