import React from "react";
import { Tooltip } from "@material-ui/core";

export { default as Avatar } from "./Avatar";
export { default as Button } from "./Button";
export { default as IconButton } from "./IconButton";
export { default as Icon } from "./Icon";

export function withTooltip(Component) {
  return function TooltippedComponent(props) {
    const {
      tooltipPlacement = "bottom",
      tooltipProps,
      children,
      tooltipHide,
      tooltipIgnoreDisabled,
      ...rest
    } = props;
    let { tooltip } = props;

    if (!rest.disabled || tooltipIgnoreDisabled) {
      if (tooltip === undefined && rest.hasOwnProperty("aria-label")) {
        tooltip = rest["aria-label"];
      }

      if (tooltip) {
        if (tooltipHide) {
          tooltip = "";
        }

        return (
          <Tooltip
            title={tooltip}
            placement={tooltipPlacement}
            {...tooltipProps}
          >
            <Component {...rest}>{children}</Component>
          </Tooltip>
        );
      }
    }

    return <Component {...rest}>{children}</Component>;
  };
}
