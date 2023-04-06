import React from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
} from "@material-ui/core";

let idIndex = 0;

class ComposedCheckbox extends React.PureComponent {
  static propTypes = {
    /**
     * If `true`, the input will be focused during the first mount.
     */
    autoFocus: PropTypes.bool,
    /**
     * Properties applied to the `Checkbox` element.
     */
    CheckboxProps: PropTypes.object,
    /**
     * If `true`, the component is checked. Use for a controlled component approach.
     */
    checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    /**
     * @ignore
     */
    children: PropTypes.node,
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * The color of the component. It supports those theme colors that make sense for this component.
     */
    color: PropTypes.oneOf(["primary", "secondary", "default"]),
    /**
     * If `true`, the input will be disabled.
     */
    disabled: PropTypes.bool,
    /**
     * If `true`, the label will be displayed in an error state.
     */
    error: PropTypes.bool,
    /**
     * Properties applied to the [`FormHelperText`](/api/form-helper-text) element.
     */
    FormHelperTextProps: PropTypes.object,
    /**
     * If `true`, the input will take up the full width of its container.
     */
    fullWidth: PropTypes.bool,
    /**
     * The helper text content.
     */
    helperText: PropTypes.node,
    /**
     * Use that property to pass a ref callback to the native input component.
     */
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    /**
     * The label content.
     */
    label: PropTypes.node,
    /**
     * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
     */
    margin: PropTypes.oneOf(["none", "dense", "normal"]),
    /**
     * Name attribute of the `checkbox` element.
     */
    name: PropTypes.string,
    /**
     * @ignore
     */
    onBlur: PropTypes.func,
    /**
     * Callback fired when the value is changed.
     *
     * @param {object} event The event source of the callback.
     * You can pull out the new value by accessing `event.target.value`.
     */
    onChange: PropTypes.func,
    /**
     * @ignore
     */
    onFocus: PropTypes.func,
    /**
     * If `true`, the label is displayed as required and the input will be required.
     */
    required: PropTypes.bool,
    /**
     * If `true`, the component is checked initially, but left in an uncontrolled state afterwards.
     */
    startChecked: PropTypes.bool,
    /**
     * The value of the `Checkbox` element.
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    required: false,
    color: "primary",
    startChecked: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      checked: !!props.startChecked,
    };
  }

  render() {
    const {
      autoFocus,
      CheckboxProps,
      checked: checkedProp,
      children,
      color,
      disabled,
      FormHelperTextProps,
      helperText,
      id,
      LabelProps,
      inputRef,
      label,
      name,
      onBlur,
      onChange,
      onFocus,
      placeholder,
      required,
      value,
      startChecked,
      ...other
    } = this.props;
    const { checked: checkedState } = this.state;

    const checked = checkedProp !== undefined ? checkedProp : checkedState;
    let controlId = !id ? "field-cc-" + idIndex++ : id;
    const helperTextId = helperText ? `${controlId}-helper-text` : undefined;

    return (
      <FormControl aria-describedby={helperTextId} {...other}>
        <FormControlLabel
          label={label}
          style={helperText ? { marginBottom: 0 } : undefined}
          control={
            <Checkbox
              autoFocus={autoFocus}
              checked={checked}
              color={color}
              disabled={disabled}
              inputRef={inputRef}
              name={name}
              onBlur={onBlur}
              onChange={this.handleChange}
              onFocus={onFocus}
              value={value}
              {...CheckboxProps}
              id={controlId}
            />
          }
        />
        {helperText && (
          <FormHelperText
            style={{
              marginTop: 0,
            }}
            {...FormHelperTextProps}
            id={helperTextId}
          >
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  }

  handleChange = (ev, checked) => {
    this.setState({ checked }, this.postChange);
  };

  postChange = () => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(true);
    }
  };
}

export default ComposedCheckbox;
