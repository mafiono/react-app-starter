import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import {
  ButtonBase,
  Button,
  Hidden,
  Typography,
  Popper,
  Fade,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SearchIcon from "@material-ui/icons/Search";

import { logo } from "../img";
import { ResponsiveMenu, Balance } from "./header/";
import { subscribeTo, PlayerContainer, AppStateContainer } from "../state";
import { VerticalPadder } from "./styled";
import { IconButton, Avatar } from "../component/ui";
import { userItems } from "../data";

class Header extends React.Component {
  state = {
    profileMenuAnchor: null,
  };

  popperOptions = {
    modifiers: {
      offset: {
        offset: "0,10",
      },
    },
  };

  render() {
    const { loggedIn } = this.props.player;

    return (
      <StyledHeader>
        {loggedIn() ? this.renderUser() : this.renderAnon()}
        <Hidden xsDown>
          <ResponsiveMenu />
        </Hidden>
      </StyledHeader>
    );
  }

  renderAnon() {
    const { appState } = this.props;

    return (
      <MainWrapper>
        <div>
          <ButtonBase focusRipple component={Link} to="/">
            <LogoImg
              src={logo}
              alt="BetBTC Online Casino - Official Site &amp; Logo"
            />
          </ButtonBase>
        </div>
        <div className="flexRow">
          <Hidden xsDown>
            <VerticalPadder top={0} bottom={0} left={1}>
              <IconButton component={Link} to="/search" aria-label="Search">
                <SearchIcon />
              </IconButton>
            </VerticalPadder>
            <VerticalPadder top={0} bottom={0} left={1}>
              <HeaderButton
                size="small"
                variant="contained"
                color="primary"
                onClick={appState.showLogin}
              >
                Login
              </HeaderButton>
            </VerticalPadder>
            <VerticalPadder top={0} bottom={0} left={1}>
              <HeaderButton
                size="small"
                variant="contained"
                component={Link}
                to="/sign-up"
              >
                Sign up
              </HeaderButton>
            </VerticalPadder>
          </Hidden>
          <Hidden smUp>
            <VerticalPadder top={0} bottom={0} left={1}>
              <IconButton onClick={appState.showNavigation}>
                <MenuIcon />
              </IconButton>
            </VerticalPadder>
          </Hidden>
        </div>
      </MainWrapper>
    );
  }

  renderUser() {
    const { appState } = this.props;
    const { player } = this.props.player.state;
    const { profileMenuAnchor } = this.state;

    return (
      <MainWrapper>
        <div>
          <ButtonBase focusRipple component={Link} to="/">
            <LogoImg
              src={logo}
              alt="BetBTC Online Casino - Official Site &amp; Logo"
            />
          </ButtonBase>
        </div>
        <Hidden xsDown>
          <div className="center">
            <Balance />
          </div>
        </Hidden>
        <div className="flexRow">
          <Hidden xsDown>
            <VerticalPadder top={0} bottom={0} left={1}>
              <IconButton component={Link} to="/search" aria-label="Search">
                <SearchIcon />
              </IconButton>
            </VerticalPadder>
            <VerticalPadder top={0} bottom={0} left={1}>
              <IconButton component={Link} to="/cashier" aria-label="Cashier">
                <MonetizationOnIcon />
              </IconButton>
            </VerticalPadder>
            <VerticalPadder top={0} bottom={0} left={1}>
              <IconButton component={Link} to="/profile" aria-label="Profile">
                <AccountCircleIcon />
              </IconButton>
            </VerticalPadder>
            <VerticalPadder top={0} bottom={0} left={1}>
              <PointedAvatar
                alt={player.username}
                src={`https://www.gravatar.com/avatar/${player.emailHash}?s=40`}
                onClick={this.handleAvatarClick}
                aria-label={`Hi ${player.username}`}
                tooltipHide={!!profileMenuAnchor}
              />
              <Popper
                open={!!profileMenuAnchor}
                anchorEl={profileMenuAnchor}
                transition
                popperOptions={this.popperOptions}
                placement="bottom-end"
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={250}>
                    <Paper>
                      <ClickAwayListener onClickAway={this.hideProfileMenu}>
                        <div>
                          <MenuUsername
                            component="p"
                            variant="body2"
                            noWrap
                            align="center"
                          >
                            <strong>{player.username}</strong>
                          </MenuUsername>
                          <Divider />
                          <MenuList disablePadding dense>
                            {userItems.map(this.renderMenuItem)}
                          </MenuList>
                        </div>
                      </ClickAwayListener>
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </VerticalPadder>
          </Hidden>
          <Hidden smUp>
            <VerticalPadder top={0} bottom={0} left={1}>
              <IconButton onClick={appState.showNavigation}>
                <MenuIcon />
              </IconButton>
            </VerticalPadder>
          </Hidden>
        </div>
      </MainWrapper>
    );
  }

  renderMenuItem = ({ label, icon, url }) => {
    const menuItemProps = {
      divider: true,
      onClick: this.hideProfileMenu,
      key: url,
    };

    if (url) {
      menuItemProps.to = url;
      menuItemProps.component = Link;
    }

    return (
      <MenuItem {...menuItemProps}>
        {icon && <ProfileListIcon>{icon}</ProfileListIcon>}
        <NoPaddingListText
          inset={!icon}
          primaryTypographyProps={{
            variant: "subtitle1",
          }}
        >
          {label}
        </NoPaddingListText>
      </MenuItem>
    );
  };

  handleAvatarClick = (ev) => {
    const { currentTarget } = ev;
    const { profileMenuAnchor } = this.state;

    this.setState({
      profileMenuAnchor: profileMenuAnchor === null ? currentTarget : null,
    });
  };

  hideProfileMenu = (ev) => {
    const { profileMenuAnchor } = this.state;

    if (profileMenuAnchor && profileMenuAnchor.contains(ev.target)) {
      return;
    }

    this.setState({ profileMenuAnchor: null });
  };
}

const MainWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	position: relative;
	align-items: center;

	& > .center {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}

	& > .flexRow {
		display: flex;
		align-items: center;
	}
`;

const LogoImg = styled.img`
	width: ${(p) => p.theme.spacing(22.5)}px;

	${(p) => p.theme.mui.breakpoints.down("sm")} {
		width: ${(p) => p.theme.spacing(15)}px;
	}
`;

const StyledHeader = styled.div`
	padding: ${(p) => p.theme.spacing()}px ${(p) => p.theme.spacing(2)}px ${(p) =>
  p.theme.spacing(2)}px;

	${(p) => p.theme.mui.breakpoints.down("xs")} {
		padding: 0 ${(p) => p.theme.spacing()}px;
	}
`;

const HeaderButton = styled(Button)`
	padding: 5px 6px;
	min-width: ${(p) => p.theme.spacing(6)}px;
	font-size: ${(p) => p.theme.pxToRem(12)};
	min-height: ${(p) => p.theme.spacing(3)}px;

	svg {
		height: ${(p) => p.theme.spacing(2.5)}px;
		width: ${(p) => p.theme.spacing(2.5)}px;
		margin-left: ${(p) => (p.variant !== "flat" ? p.theme.spacing(0.5) : 0)}px;
	}
`;

const NoPaddingListText = styled(ListItemText)`
	padding-left: 0;
	padding-right: 0;
`;

const ProfileListIcon = styled(ListItemIcon)`
	margin-right: ${(p) => p.theme.spacing()}px;
`;

const MenuUsername = styled(Typography)`
	max-width: ${(p) => p.theme.spacing(25)}px;
	padding: ${(p) => p.theme.spacing()}px;
	font-size: ${(p) => p.theme.pxToRem(13)};
	cursor: default;
`;

const PointedAvatar = styled(Avatar)`
	cursor: pointer;
`;

export default subscribeTo(
  {
    player: PlayerContainer,
    appState: AppStateContainer,
  },
  Header
);
