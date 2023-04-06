import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import styled from "styled-components/macro";
import CloseIcon from "@material-ui/icons/Close";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import deepmerge from "deepmerge";

import { List, Editor } from "./pevo";
import { IconButton } from "./ui";

class Pevo extends React.PureComponent {
  state = {
    view: "list",
    listExpansions: [],
  };

  render() {
    const { view, listExpansions } = this.state;
    const {
      onClose,
      themes,
      onActiveThemeChange,
      activeTheme,
      onDelete,
      onCopy,
      onReset,
      onSave,
    } = this.props;

    return (
      <Wrapper>
        <AppBar position="static">
          <Toolbar>
            {view === "edit" && (
              <IconButton
                onClick={this.showList}
                color="inherit"
                aria-label="Back to list"
              >
                <ChevronLeftIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              color="inherit"
              align="center"
              style={{ flexGrow: 1 }}
              noWrap
            >
              {this.renderTitle()}
            </Typography>
            <IconButton
              onClick={onClose}
              color="inherit"
              aria-label="Close StyleD"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {view === "list" && (
          <List
            activeTheme={activeTheme}
            onActiveThemeChange={onActiveThemeChange}
            themes={themes}
            onEdit={this.showEditor}
            onCopy={onCopy}
            onReset={onReset}
            onSave={onSave}
            onDelete={onDelete}
            onExpandToggle={this.handleListExpandToggle}
            expansions={listExpansions}
          />
        )}
        {view === "edit" && this.renderEditor()}
      </Wrapper>
    );
  }

  renderEditor() {
    const { themes, activeTheme, onReset, onSave } = this.props;
    let otherThemeIds = [];
    let theme = null;

    for (const t of themes) {
      if (t.id === activeTheme) {
        theme = t;
      } else {
        otherThemeIds.push(t.id);
      }
    }

    return (
      <Editor
        onChange={this.handleChange}
        otherThemeIds={otherThemeIds}
        theme={theme}
        onReset={onReset}
        onSave={onSave}
        onDelete={this.handleEditorDelete}
      />
    );
  }

  renderTitle() {
    const { view } = this.state;

    if (view === "list") {
      return "StyleD";
    }

    if (view === "edit") {
      const { activeTheme } = this.props;

      return activeTheme;
    }
  }

  showList = () => {
    this.setState({ view: "list" });
  };

  showEditor = () => {
    this.setState({ view: "edit" });
  };

  handleEditorDelete = () => {
    const { activeTheme, themes, onDelete } = this.props;

    let theme = themes.find((t) => t.id === activeTheme);

    onDelete(theme);
    this.showList();
  };

  handleListExpandToggle = (themeId) => {
    let { listExpansions } = this.state;
    const themeIdIndex = listExpansions.indexOf(themeId);

    listExpansions = listExpansions.slice(0);

    if (themeIdIndex === -1) {
      listExpansions.push(themeId);
    } else {
      listExpansions.splice(themeIdIndex, 1);
    }

    this.setState({ listExpansions });
  };

  handleChange = (path, color) => {
    const { onChange } = this.props;

    if (!onChange) {
      return;
    }

    const { activeTheme, themes } = this.props;

    let themeMeta = themes.find((t) => t.id === activeTheme);

    if (!themeMeta) {
      return;
    }

    // make theme backup
    if (!themeMeta.backup) {
      themeMeta.backup = deepmerge({}, themeMeta.blueprint);
    }

    let section = themeMeta.blueprint;
    const lastProp = path[path.length - 1];
    path = path.slice(0, path.length - 1);

    path.forEach((property) => {
      if (!section.hasOwnProperty(property)) {
        return;
      }

      section = section[property];
    });

    const cssColor =
      color.rgb.a === 1
        ? color.hex
        : `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;

    section[lastProp] = cssColor;

    onChange(themeMeta);
  };
}

const Wrapper = styled.div`
	width: 85vw;
	height: 100%;
	max-width: 350px;
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	background-color: ${(p) => p.theme.mui.palette.background.default};

	& > div.content {
		overflow-y: scroll;
		flex-grow: 1;
	}
`;

export default Pevo;
