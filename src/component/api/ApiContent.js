import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { styles as typographyStyleSrc } from "@material-ui/core/Typography/Typography";

import { returnStyles } from "../../theme";

import "./ApiContent.css";
import { subscribeTo, PlayerContainer } from "../../state";

function removeTag(html, tag) {
  const tagOpen = `<${tag}>`;

  if (!html.includes(tagOpen)) {
    return html;
  }

  return html.split(tagOpen).join("").split(`</${tag}>`).join("");
}

function removeTagWithContent(html, tag) {
  const tagOpen = `<${tag}>`;

  if (!html.includes(tagOpen)) {
    return html;
  }

  const tagClose = `</${tag}>`;

  let tagOpenPosition = html.indexOf(tagOpen);

  while (tagOpenPosition !== -1) {
    let tagClosePosition = html.indexOf(tagClose, tagOpenPosition);

    if (tagClosePosition !== -1) {
      const start = html.substring(0, tagOpenPosition);
      html = start + html.substring(tagClosePosition + tagClose.length);
    }

    tagOpenPosition = html.indexOf(tagOpen);
  }

  return html;
}

const styles = (theme) => {
  const typographyStyles = returnStyles(typographyStyleSrc, theme);

  const combinedStyles = {
    root: {
      ...typographyStyles.body2,

      "& .colorPrimary": {
        color: theme.palette.primary.main + " !important",
      },
      "& .colorSecondary": {
        color: theme.palette.secondary.main + " !important",
      },
      "& .colorTextPrimary": {
        color: theme.palette.text.primary + " !important",
      },
      "& .colorTextSecondary": {
        color: theme.palette.text.secondary + " !important",
      },
      "& .colorError": {
        color: theme.palette.error.main + " !important",
      },
    },
  };

  Object.keys(typographyStyles).forEach((key) => {
    if (key === "body2") {
      return;
    }

    combinedStyles.root["& .__typography." + key] = typographyStyles[key];
  });

  return combinedStyles;
};

class ApiContent extends React.PureComponent {
  static propTypes = {
    component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.object,
    ]),
    children: PropTypes.string,
  };

  static defaultProps = {
    component: "div",
  };

  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  componentDidMount() {
    const { current } = this.ref;

    if (current !== null) {
      current.addEventListener("click", this.handleClick);
    }
  }

  componentWillUnmount() {
    const { current } = this.ref;

    if (current !== null) {
      current.removeEventListener("click", this.handleClick);
    }
  }

  render() {
    const { children, classes, component, player } = this.props;

    if (!children || typeof children !== "string") {
      return null;
    }

    let html = children.replace(/__typography__/gi, "__typography root");
    const Component = component;

    if (player.loggedIn()) {
      html = removeTag(html, "player");
      html = removeTagWithContent(html, "anon");
    } else {
      html = removeTag(html, "anon");
      html = removeTagWithContent(html, "player");
    }

    return (
      <Component
        ref={this.ref}
        dangerouslySetInnerHTML={{ __html: html }}
        className={classes.root + " apiContent"}
      />
    );
  }

  handleClick = (ev) => {
    if (ev.target && ev.target.hasAttribute("data-open")) {
      ev.preventDefault();
      const { history } = this.props;

      history.push(ev.target.dataset.open);
    }
  };
}

export default withStyles(styles, { name: "ApiContent" })(
  withRouter(
    subscribeTo(
      {
        player: PlayerContainer,
      },
      ApiContent
    )
  )
);
