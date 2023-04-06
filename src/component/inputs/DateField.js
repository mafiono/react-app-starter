import React from "react";
import PropTypes from "prop-types";
import DatePicker from "material-ui-pickers/DatePicker";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import format from "date-fns/format";
import { TextField } from "@material-ui/core";

import ControlledField from "./ControlledField";
import { subscribeTo, AppStateContainer } from "../../state";

class DateField extends ControlledField {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    minDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    label: PropTypes.string,
    autoOk: PropTypes.bool,
    showTodayButton: PropTypes.bool,
  };

  static defaultProps = {
    autoOk: true,
    showTodayButton: true,
  };

  render() {
    const { value } = this.state;
    const {
      value: valueProp,
      name,
      appState,
      _renderIndex,
      minDate,
      autoOk,
      showTodayButton,
      ...rest
    } = this.props;

    return (
      <>
        {appState.state.isMobile ? (
          <TextField
            type="date"
            value={value || ""}
            onChange={(ev) => this.handleChange(ev.currentTarget.value)}
            InputLabelProps={{
              shrink: true,
            }}
            {...rest}
          />
        ) : (
          <DatePicker
            leftArrowIcon={<KeyboardArrowLeftIcon />}
            rightArrowIcon={<KeyboardArrowRightIcon />}
            onChange={this.handleChange}
            value={value}
            format="MMMM do yyyy"
            minDate={minDate}
            autoOk={autoOk}
            showTodayButton={showTodayButton}
            {...rest}
          />
        )}
        {value && (
          <input
            type="hidden"
            name={name}
            value={format(value, "YYYY-MM-dd")}
          />
        )}
      </>
    );
  }
}

export default subscribeTo(
  {
    appState: AppStateContainer,
  },
  DateField
);
