import React from "react";
import PropTypes from "prop-types";
import { Link, NavLink, withRouter } from "react-router-dom";
import styled from "styled-components/macro";
import {
  Button,
  IconButton,
  MenuList,
  MenuItem,
  Typography,
  Popper,
  Fade,
  Paper,
  ClickAwayListener,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import { menuItems } from "../../data";

class ResponsiveMenu extends React.Component {
  static propTypes = {
    interfaceResizeIndex: PropTypes.number,
  };

  static defaultProps = {
    interfaceResizeIndex: 0,
  };

  popperOptions = {
    modifiers: {
      offset: {
        offset: "0,10",
      },
    },
  };

  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();
    this.overflowRef = React.createRef();

    this.state = {
      displayItems: undefined,
      moreMenuAnchor: null,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);

    this.sizeLayout();
    setTimeout(this.triggerSizing, 500);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.interfaceResizeIndex < this.props.interfaceResizeIndex ||
      (prevState.displayItems !== undefined &&
        this.state.displayItems === undefined)
    ) {
      this.closeMore();
      this.sizeLayout();
    }

    if (prevProps.location.key !== this.props.location.key) {
      this.triggerSizing();
    }
  }

  componentWillUnmount() {
    this._unmounted = true;

    window.removeEventListener("resize", this.handleWindowResize);
  }

  render() {
    const { displayItems } = this.state;

    return (
      <MenuContainer>
        <Wrapper
          className={Array.isArray(displayItems) ? "filtered-items" : null}
          ref={this.wrapperRef}
        >
          <Overlay ref={this.overflowRef}>{this.renderItems()}</Overlay>
        </Wrapper>
        <MoreButtonWrapper show={Array.isArray(displayItems)}>
          <MoreButton onClick={this.handleMoreButton}>
            <MenuIcon />
          </MoreButton>
        </MoreButtonWrapper>
        {this.renderMenu()}
      </MenuContainer>
    );
  }

  renderItems() {
    const { displayItems } = this.state;

    const filteredItems = Array.isArray(displayItems)
      ? menuItems.filter((item, i) => displayItems.indexOf(i) !== -1)
      : menuItems;
    return filteredItems.map(this.renderButton);
  }

  renderButton = (button) => {
    return (
      <Button
        key={button.url}
        to={button.url}
        component={NavLink}
        size="small"
        exact={!!button.exact}
      >
        {button.label}
      </Button>
    );
  };

  renderMenu() {
    const { moreMenuAnchor, displayItems } = this.state;

    const filteredMenuItems = Array.isArray(displayItems)
      ? menuItems.filter((item, i) => displayItems.indexOf(i) === -1)
      : [];
    return (
      <Popper
        open={filteredMenuItems.length !== 0 && !!moreMenuAnchor}
        anchorEl={moreMenuAnchor}
        transition
        popperOptions={this.popperOptions}
        placement="bottom-end"
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={250}>
            <Paper>
              <ClickAwayListener onClickAway={this.closeMore}>
                <div>
                  <MenuList disablePadding dense>
                    {filteredMenuItems.map(this.renderMenuItem)}
                  </MenuList>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    );
  }

  renderMenuItem = (item, index, items) => {
    return (
      <MenuItem
        key={item.url}
        onClick={this.closeMore}
        component={Link}
        to={item.url}
        divider={index < items.length - 1}
      >
        <Typography component="p" size="inherit">
          {item.label}
        </Typography>
      </MenuItem>
    );
  };

  handleWindowResize = () => {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(this.windowResized, 166);
  };

  windowResized = () => {
    this.triggerSizing();
    setTimeout(this.triggerSizing, 166);
  };

  handleMoreButton = (ev) => {
    const { currentTarget } = ev;
    const { moreMenuAnchor } = this.state;

    this.setState({
      moreMenuAnchor: moreMenuAnchor === null ? currentTarget : null,
    });
  };

  closeMore = (ev) => {
    const { moreMenuAnchor } = this.state;

    if (
      typeof ev === "object" &&
      ev.hasOwnProperty("target") &&
      moreMenuAnchor &&
      moreMenuAnchor.contains(ev.target)
    ) {
      return;
    }

    this.setState({ moreMenuAnchor: null });
  };

  triggerSizing = () => {
    if (this._unmounted) {
      return;
    }

    this.setState({ displayItems: undefined });
  };

  sizeLayout = () => {
    const { current: wrapper } = this.wrapperRef;
    const { current: overflow } = this.overflowRef;

    if (this._unmounted || !wrapper || !overflow) {
      return;
    }

    let wrapperRect = wrapper.getBoundingClientRect();
    let displayItems = [];
    const nodes = overflow.childNodes;
    const originallyFiltered = wrapper.classList.contains("filtered-items");

    if (originallyFiltered) {
      wrapper.classList.remove("filtered-items");
    }

    let overflowRect = overflow.getBoundingClientRect();

    if (overflowRect.height - wrapperRect.height > 5) {
      wrapper.classList.add("filtered-items");

      let activeIndex = -1;
      const numOfNodes = nodes.length;

      for (const [i, child] of nodes.entries()) {
        if (child.classList.contains("active")) {
          activeIndex = i;
          continue;
        }

        child.style.display = "none";
      }

      let i = 0;
      let activeItemPresent = false;

      for (; i < numOfNodes; i++) {
        if (i === activeIndex) {
          activeItemPresent = true;
          displayItems.push(i);
          continue;
        }

        const child = nodes[i];
        child.style.display = null;

        overflowRect = overflow.getBoundingClientRect();

        if (overflowRect.height - wrapperRect.height > 5) {
          break;
        } else {
          displayItems.push(i);
        }
      }

      if (activeIndex !== -1 && !activeItemPresent) {
        displayItems.push(activeIndex);
      }

      if (numOfNodes > 0 && displayItems.length === 0) {
        displayItems.push(0);
      } else if (numOfNodes === displayItems.length) {
        displayItems = null;
      }
    } else {
      displayItems = null;
    }

    for (const [, child] of nodes.entries()) {
      child.style.display = null;
    }

    if (originallyFiltered) {
      wrapper.classList.add("filtered-items");
    } else {
      wrapper.classList.remove("filtered-items");
    }

    this.setState({ displayItems });
  };
}

const Wrapper = styled.div`
	margin: 0;
	padding: 0;
	border: 0;
	width: 100%;
	height: 36px;
	overflow: hidden;
	position: relative;

	&.filtered-items {
		width: calc(100% - 36px);
	}
`;

const Overlay = styled.div`
	margin: 0;
	padding: 0;
	border: 0;
	text-align: center;

	& > a {
		margin: 0 ${(p) => p.theme.spacing(0.5)}px;
		background-color: transparent;
		transition: ${(p) => p.theme.createTransition("color", "shortest")};
	}
	& > a.active {
		color: ${(p) => p.theme.mui.palette.primary.light};
	}
`;

const MenuContainer = styled.div`
	overflow: hidden;
	position: relative;
`;

const MoreButtonWrapper = styled.div`
	width: 36px;
	height: 36px;
	position: absolute;
	top: 0;
	right: 0;
	transition: ${(p) => p.theme.createTransition("transform", "enteringScreen")};

	${(p) => {
    if (!p.show) {
      return `
				transform: translateX(100%);
			`;
    }
  }}
`;

const MoreButton = styled(IconButton)`
	width: 36px;
	height: 36px;
	display: inline-block;
	padding: 0;
`;

export default withRouter(ResponsiveMenu);
