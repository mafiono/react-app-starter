import React from "react";
import { Typography, Popover } from "@material-ui/core";
import { SketchPicker } from "react-color";
import { default as colorHelpers } from "react-color/lib/helpers/color";
import styled from "styled-components/macro";

import checkered_pattern from "../../../img/tmp/checkered_pattern.svg";
import { defaultMuiThemeColors } from "../../../theme";
import { searchForColor } from "../../../theme";

const themeColors = searchForColor(defaultMuiThemeColors).map((color) => {
  return {
    color: color.value,
    title: color.path.join("."),
  };
});

class Color extends React.PureComponent {
  state = {
    background: "gray",
    overriddenTransparent: false,
    pickerAnchor: null,
  };

  render() {
    const { color } = this.props;
    const { background, pickerAnchor } = this.state;
    const combinedPaths = color.path.join(".");
    const colorMeta = colorHelpers.toState(color.value);
    const cssValue =
      colorMeta.rgb.a === 1
        ? colorMeta.hex
        : `rgba(${colorMeta.rgb.r}, ${colorMeta.rgb.g}, ${colorMeta.rgb.b}, ${colorMeta.rgb.a})`;

    return (
      <ColorWrapper>
        <Typography variant="subtitle1" color="primary">
          {combinedPaths}
        </Typography>
        <Typography color="primary">{cssValue}</Typography>
        <BackgroundSwatches>
          {["checkered", "black", "gray", "white"].map((current) => {
            let classes = current;

            if (current === background) {
              classes += " active";
            }

            return (
              <li
                key={current}
                className={classes}
                onClick={this.handleBackgroundChange(current)}
              />
            );
          })}
        </BackgroundSwatches>
        <ColorSwatchWrapper
          background={background}
          onClick={this.handleSwatchClick}
        >
          <div style={{ backgroundColor: cssValue }} />
        </ColorSwatchWrapper>
        <Popover
          open={!!pickerAnchor}
          anchorEl={pickerAnchor}
          onClose={this.handlePickerClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <SketchPicker
            color={color.value}
            onChange={this.handleColorChange}
            presetColors={themeColors}
          />
        </Popover>
      </ColorWrapper>
    );
  }

  handleSwatchClick = (ev) => {
    this.setState({ pickerAnchor: ev.currentTarget });
  };

  handlePickerClose = () => {
    this.setState({ pickerAnchor: null });
  };

  handleBackgroundChange = (background) => () => {
    if (background === this.state.background) {
      return;
    }

    const newState = { background };

    if (background !== "checkered") {
      const colorMeta = colorHelpers.toState(this.props.color.value);

      if (colorMeta.rgb.a !== 1) {
        newState.overriddenTransparent = true;
      }
    }

    this.setState(newState);
  };

  handleColorChange = (newColor) => {
    const { overriddenTransparent } = this.state;
    const { onChange, color } = this.props;

    if (!overriddenTransparent && newColor.rgb.a !== 1) {
      this.setState({ background: "checkered" });
    }

    if (onChange) {
      onChange(color.path, newColor);
    }
  };
}

const ColorWrapper = styled.div`
	text-align: center;
	padding: .3em 0;
`;

const ColorSwatchWrapper = styled.div`
	border-radius: .3em;
	border: .2em solid #666;
	padding: .3em;
	box-shadow: 0 0 .5em rgba(0, 0, 0, .7);
	height: 4em;
	width: 5em;
	background: ${(p) => {
    if (p.background === "checkered") {
      return `url(${checkered_pattern})`;
    }

    return p.background;
  }};
	cursor: pointer;
	margin: .3em auto;

	& > div {
		width: 100%;
		height: 100%;
	}
`;

const BackgroundSwatches = styled.ol`
	margin: 0;
	padding: 0;
	display: inline-block;

	& > li {
		display: inline-block;
		list-style: none;
		padding: 0;
		margin: .2em;
		width: 3em;
		height: 2em;
		border: 1px solid #666;
	}

	& > li.active {
		border-color: #f00;
	}

	& > li.checkered {
		background-image: url(${checkered_pattern});
	}

	& > li.black {
		background-color: #000;
	}

	& > li.white {
		background-color: #fff;
	}

	& > li.gray {
		background-color: #808080;
	}
`;

export default Color;
