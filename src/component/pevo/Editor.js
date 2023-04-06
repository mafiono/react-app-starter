import React from "react";
import { Typography, Grid, TextField } from "@material-ui/core";
import styled from "styled-components/macro";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import ThreeSixtyIcon from "@material-ui/icons/ThreeSixty";

import { IconButton } from "../ui";
import { searchForColor } from "../../theme";
import { Color } from "./editor";

class Editor extends React.PureComponent {
  state = {
    newThemeId: null,
  };

  render() {
    const { otherThemeIds, theme, onChange, onDelete } = this.props;

    if (theme.id === "default") {
      return (
        <Typography variant="subtitle1" color="error" align="center">
          Can't edit default style
        </Typography>
      );
    }

    const { newThemeId } = this.state;
    const textFieldProps = {
      value: theme.id,
      helperText: <span>&nbsp;</span>,
    };

    let disableSave = !theme.backup;
    let disableReset = !theme.backup;

    if (newThemeId !== null && newThemeId !== theme.id) {
      textFieldProps.value = newThemeId;
      disableReset = false;

      if (newThemeId === "") {
        textFieldProps.helperText = "Please specify an ID";
        textFieldProps.error = true;
      } else if (otherThemeIds.indexOf(newThemeId) !== -1) {
        textFieldProps.helperText = "ID already taken";
        textFieldProps.error = true;
      }

      if (!textFieldProps.error) {
        disableSave = false;
      }
    }

    return (
      <>
        <div className="content">
          <TitleFieldWrapper>
            <TextField
              label="Theme ID"
              margin="dense"
              required={newThemeId !== null && newThemeId !== theme.id}
              onChange={this.handleIdChange}
              fullWidth
              {...textFieldProps}
            />
          </TitleFieldWrapper>
          {searchForColor(theme.blueprint).map((color) => (
            <Color
              key={color.path.join(".")}
              color={color}
              onChange={onChange}
            />
          ))}
        </div>
        <Actions>
          <Grid
            container
            spacing={16}
            style={{ padding: 8 }}
            alignItems="center"
            justify="space-around"
          >
            <Grid item>
              <IconButton
                aria-label="Reset changes"
                variant="fab"
                size="small"
                disabled={disableReset}
                onClick={this.handleReset}
              >
                <ThreeSixtyIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                aria-label="Save changes"
                variant="fab"
                size="small"
                color="primary"
                disabled={disableSave}
                onClick={this.handleSave}
              >
                <SaveAltIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                aria-label="Delete"
                variant="fab"
                size="small"
                color="secondary"
                onClick={() => onDelete(theme)}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Actions>
      </>
    );
  }

  handleIdChange = (ev) => {
    this.setState({ newThemeId: ev.target.value });
  };

  handleSave = () => {
    const { onSave, theme } = this.props;
    const { newThemeId } = this.state;

    if (newThemeId !== null && newThemeId !== theme.id) {
      theme.newId = newThemeId;
    }

    onSave(theme);
  };

  handleReset = () => {
    const { onReset, theme } = this.props;

    this.setState({ newThemeId: null });
    onReset(theme);
  };
}

const Actions = styled.div`
	text-align: center;
	padding: ${(p) => p.theme.spacing()}px;
	background: ${(p) => p.theme.mui.palette.background.paper};
`;

const TitleFieldWrapper = styled.div`
	padding: ${(p) => p.theme.spacing()}px ${(p) => p.theme.spacing()}px 0;
`;

export default Editor;
