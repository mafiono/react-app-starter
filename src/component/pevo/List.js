import React from "react";
import styled from "styled-components/macro";
import {
  Grid,
  Collapse,
  Divider,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import ThreeSixtyIcon from "@material-ui/icons/ThreeSixty";

import { IconButton } from "../ui";

function List(props) {
  const {
    themes,
    onActiveThemeChange,
    onEdit,
    onExpandToggle,
    expansions,
    activeTheme,
    onDelete,
    onCopy,
    onReset,
    onSave,
  } = props;

  const defaultTheme = themes.find((t) => t.id === "default");

  return (
    <div className="content">
      <MuiList component="nav" disablePadding>
        <ListItem
          key="default"
          active={activeTheme === "default"}
          theme={defaultTheme}
          onClick={onActiveThemeChange}
          onCopy={onCopy}
          onEdit={onEdit}
          onExpandToggle={onExpandToggle}
          onReset={onReset}
          expand={expansions.indexOf("default") !== -1}
        />
        {themes.map((theme) => {
          if (theme.id === "default") {
            return null;
          }

          return (
            <ListItem
              key={theme.id}
              active={theme.id === activeTheme}
              theme={theme}
              onClick={onActiveThemeChange}
              onCopy={onCopy}
              onEdit={onEdit}
              onSave={onSave}
              onExpandToggle={onExpandToggle}
              onReset={onReset}
              expand={expansions.indexOf(theme.id) !== -1}
              onDelete={onDelete}
            />
          );
        })}
      </MuiList>
    </div>
  );
}

class ListItem extends React.PureComponent {
  render() {
    const { theme, expand, active, onDelete, onSave } = this.props;
    const madeChanges = theme.hasOwnProperty("backup");

    return (
      <>
        <Divider />
        <StyledMuiListItem
          button
          key={theme.id}
          onClick={this.activateTheme}
          selected={active}
        >
          <ListItemText
            primary={theme.id}
            primaryTypographyProps={
              madeChanges ? { color: "error" } : undefined
            }
          />
          <ListItemSecondaryAction>
            {theme.id !== "default" && (
              <IconButton aria-label="Edit" onClick={this.handleEdit}>
                <EditIcon />
              </IconButton>
            )}
            <IconButton
              aria-label={expand ? "Hide actions" : "Show actions"}
              onClick={this.handleToggleExpand}
              tooltip={expand ? "" : "Actions"}
            >
              {expand ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
          </ListItemSecondaryAction>
        </StyledMuiListItem>
        <Collapse in={expand} timeout="auto" unmountOnExit>
          <ExpansionActionsWrapper>
            <Grid container spacing={8} alignItems="center" justify="flex-end">
              {madeChanges && (
                <Grid item>
                  <IconButton
                    aria-label="Reset changes"
                    onClick={this.handleReset}
                  >
                    <ThreeSixtyIcon />
                  </IconButton>
                </Grid>
              )}
              {madeChanges && onSave && (
                <Grid item>
                  <IconButton
                    aria-label="Save changes"
                    onClick={this.handleSave}
                  >
                    <SaveAltIcon />
                  </IconButton>
                </Grid>
              )}
              <Grid item>
                <IconButton aria-label="Copy" onClick={this.handleCopy}>
                  <FileCopyIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  aria-label="Delete"
                  onClick={this.handleDelete}
                  disabled={!onDelete}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </ExpansionActionsWrapper>
        </Collapse>
      </>
    );
  }

  handleEdit = () => {
    const { onEdit } = this.props;

    this.activateTheme();
    onEdit();
  };

  activateTheme = () => {
    const { theme, onClick } = this.props;

    onClick(theme.id);
  };

  handleToggleExpand = () => {
    const { theme, onExpandToggle } = this.props;

    onExpandToggle(theme.id);
  };

  handleDelete = () => {
    const { theme, onDelete } = this.props;

    if (onDelete) {
      onDelete(theme);
    }
  };

  handleCopy = () => {
    const { theme, onCopy } = this.props;

    if (onCopy) {
      onCopy(theme);
    }
  };

  handleReset = () => {
    const { theme, onReset } = this.props;

    if (onReset) {
      onReset(theme);
    }
  };

  handleSave = () => {
    const { theme, onSave } = this.props;

    if (onSave) {
      onSave(theme);
    }
  };
}

const ExpansionActionsWrapper = styled.div`
	box-shadow: inset 0em 3em 3em -2em rgba(0, 0, 0, .5);
	padding: ${(p) => p.theme.spacing()}px;
	padding-bottom: ${(p) => p.theme.spacing(0.75)}px;
`;

const StyledMuiListItem = styled(MuiListItem)`
	background: ${(p) =>
    p.selected ? p.theme.mui.palette.action.selected : "transparent"};
`;

export default List;
