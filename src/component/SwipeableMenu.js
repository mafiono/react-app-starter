import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components/macro";
import {
  SwipeableDrawer,
  ButtonBase,
  withWidth,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Grid,
  Avatar,
} from "@material-ui/core";
import { isWidthDown } from "@material-ui/core/withWidth";
import { default as SyncIcon } from "@material-ui/icons/Sync";
import { default as MoneyOffIcon } from "@material-ui/icons/MoneyOff";
import SearchIcon from "@material-ui/icons/Search";

import {
  subscribeTo,
  AppStateContainer,
  PlayerContainer,
  PlayerBalanceContainer,
  PaymentWithdrawalsContainer,
} from "../state";
import { logo } from "../img";
import { menuItems, footerItems, userItems } from "../data";
import { VerticalPadder } from "./styled";
import { formatCurrency } from "../util";
import { LoadingIndicator } from "../component";

const AnonTop = React.memo(({ hideNavigation, showLogin }) => {
  return (
    <Grid container justify="center" spacing={8}>
      <Grid item>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            hideNavigation();
            showLogin();
          }}
        >
          Login
        </Button>
      </Grid>
      <Grid item>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          component={Link}
          to="/sign-up"
          onClick={hideNavigation}
        >
          Sign up
        </Button>
      </Grid>
    </Grid>
  );
});

const UserTop = React.memo(
  ({
    player: {
      state: { player },
    },
    playerBalance,
    appState,
  }) => {
    const refreshBalance = () => playerBalance.fetch(true);

    let balanceText = "...";
    let bonusText = "...";
    let isLoadingBalance = playerBalance.loading();

    if (playerBalance.valuesLoaded()) {
      const { balance, bonus } = playerBalance.state;

      balanceText = (
        <strong>
          {player.currencySymbol} {formatCurrency(balance)}
        </strong>
      );

      if (playerBalance.hasBonus()) {
        bonusText = (
          <strong>
            {player.currencySymbol} {formatCurrency(bonus)}
          </strong>
        );
      } else {
        bonusText = <em>none currently</em>;
      }
    }

    return (
      <VerticalPadder top={0} bottom={1} left={1} right={1}>
        <Grid
          container
          wrap="nowrap"
          spacing={8}
          justify="space-between"
          alignItems="center"
        >
          <Grid item zeroMinWidth>
            <Typography
              component="p"
              variant="body2"
              noWrap
              aria-label="Username"
            >
              {player.username}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="fab"
              aria-label="Refresh balance"
              onClick={refreshBalance}
              mini
              color="secondary"
            >
              <SyncIcon />
            </Button>
          </Grid>
        </Grid>
        <Grid container wrap="nowrap" spacing={16} alignItems="center">
          <Grid item>
            <UserAvatar
              alt={player.username}
              src={`https://www.gravatar.com/avatar/${player.emailHash}?s=80`}
              to="/profile"
              component={Link}
              onClick={appState.hideNavigation}
            />
          </Grid>
          <Grid item zeroMinWidth>
            <LoadingIndicator
              loadingMessage=""
              active={isLoadingBalance}
              noOverlayBg
            >
              <DetailsLabel component="p">Balance</DetailsLabel>
              <DetailsValue
                component="p"
                color="primary"
                disabled={isLoadingBalance}
                gutterBottom
                noWrap
              >
                {balanceText}
              </DetailsValue>
              <DetailsLabel component="p">Bonus</DetailsLabel>
              <DetailsValue
                component="p"
                color="primary"
                disabled={isLoadingBalance}
                noWrap
              >
                {bonusText}
              </DetailsValue>
            </LoadingIndicator>
          </Grid>
        </Grid>
      </VerticalPadder>
    );
  },
  (prevProps, nextProps) => {
    const {
      player: {
        state: { player: prevPlayer },
      },
      playerBalance: {
        state: { balance: prevBalance, bonus: prevBonus },
      },
    } = prevProps;

    const {
      player: {
        state: { player },
      },
      playerBalance: {
        state: { balance, bonus },
      },
    } = nextProps;

    if (
      prevPlayer !== player ||
      prevBalance !== balance ||
      prevBonus !== bonus
    ) {
      return false;
    }

    return true;
  }
);

const DetailsLabel = styled(Typography)`
	font-size: ${(p) => p.theme.pxToRem(10)};
	line-height: 1.1;
`;

const DetailsValue = styled(Typography)`
	font-size: ${(p) => p.theme.pxToRem(13)};
	${(p) => p.disabled && "color: #cabaa0;"}
`;

const UserAvatar = styled(Avatar)`
	width: 80px;
	height: 80px;
	margin-left: ${(p) => p.theme.spacing()}px;
`;

class SwipeableMenu extends React.Component {
  render() {
    const { width, appState, player, playerBalance, paymentWithdrawals } =
      this.props;
    const isWideEnough = isWidthDown("xs", width);
    const isUser = player.loggedIn();

    return (
      <SwipeableDrawer
        open={isWideEnough && appState.state.showMobileMenu}
        onOpen={appState.showNavigation}
        onClose={appState.hideNavigation}
        disableDiscovery={!isWideEnough}
        disableSwipeToOpen={!isWideEnough}
        anchor="right"
      >
        <Wrapper>
          <VerticalPadder top={1} bottom={1} left={1} right={1}>
            <Typography component="div" align="center">
              <ButtonBase
                focusRipple
                component={Link}
                to="/"
                onClick={appState.hideNavigation}
              >
                <LogoImg
                  src={logo}
                  alt="BetBTC Online Casino - Official Site &amp; Logo"
                />
              </ButtonBase>
            </Typography>
          </VerticalPadder>
          {isUser ? (
            <UserTop
              appState={appState}
              player={player}
              playerBalance={playerBalance}
            />
          ) : (
            <AnonTop
              hideNavigation={appState.hideNavigation}
              showLogin={appState.showLogin}
            />
          )}
          <div className="menu">
            <StyledList component="nav">
              {this.renderMenuItem({
                label: `Search`,
                url: "/search",
                icon: <SearchIcon />,
              })}
            </StyledList>
            {isUser && (
              <>
                <ListLabel variant="caption">User</ListLabel>
                <StyledList component="nav">
                  {paymentWithdrawals.hasPending() &&
                    this.renderMenuItem({
                      label: `Pending WD`,
                      url: "/profile/transaction-log",
                      icon: <MoneyOffIcon />,
                      warning: true,
                    })}
                  {userItems.map(this.renderMenuItem)}
                </StyledList>
              </>
            )}
            <ListLabel variant="caption">Navigation</ListLabel>
            <StyledList component="nav">
              {menuItems.map(this.renderMenuItem)}
            </StyledList>
            <ListLabel variant="caption">Help</ListLabel>
            <StyledList component="nav">
              {footerItems.map(this.renderMenuItem)}
            </StyledList>
          </div>
        </Wrapper>
      </SwipeableDrawer>
    );
  }

  renderMenuItem = ({ url, exact, icon, label, warning }) => {
    const { appState } = this.props;

    return (
      <StyledListItem
        button
        key={url}
        component={NavLink}
        onClick={appState.hideNavigation}
        to={url}
        exact={!!exact}
      >
        <StyledIcon>{icon}</StyledIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{
            variant: "body1",
            color: warning ? "error" : "default",
          }}
        />
      </StyledListItem>
    );
  };
}

const Wrapper = styled.div`
	width: 85vw;
	height: 100%;
	max-width: 250px;
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	background-color: ${(p) => p.theme.mui.palette.background.default};
	overflow: hidden;

	& > div.menu {
		padding: ${(p) => p.theme.spacing(2)}px 0 ${(p) => p.theme.spacing()}px;
		overflow: scroll;
	}
`;

const LogoImg = styled.img`
	width: 100%;
	max-width: ${(p) => p.theme.spacing() + 180}px;
`;

const ListLabel = styled(Typography)`
	margin-left: ${(p) => p.theme.spacing(7)}px;
	text-transform: uppercase;
	color: ${(p) => p.theme.mui.palette.primary.main};
`;

const StyledList = styled(List)`
	padding-top: ${(p) => p.theme.spacing(0.5)}px;
	padding-bottom: ${(p) => p.theme.spacing()}px;

	& > a::before {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: auto;
		width: ${(p) => p.theme.spacing(5)}px;
		background: rgba(255, 255, 255, .1);
	}

	& > a:first-child::before {
		border-top-right-radius: .25em;
	}

	& > a:last-child::before {
		border-bottom-right-radius: .25em;
	}

	& > a span {
		font-weight: bold;
		transition: ${(p) => p.theme.createTransition("color", "shortest")};
	}

	& > a.active > svg {
		transition: ${(p) => p.theme.createTransition("fill", "shortest")};
	}

	& > a.active span,
	& > a.active > svg {
		color: ${(p) => p.theme.mui.palette.primary.main};
		fill: ${(p) => p.theme.mui.palette.primary.main};
	}

	& > a:hover span {
		color: ${(p) => p.theme.mui.palette.primary.light};
	}
`;

const StyledListItem = styled(ListItem)`
	padding: ${(p) => p.theme.spacing()}px ${(p) => p.theme.spacing(2)}px;
	padding-left: 0;
	position: relative;
`;

const StyledIcon = styled(ListItemIcon)`
	margin: 0 ${(p) => p.theme.spacing()}px;
`;

export default subscribeTo(
  {
    appState: AppStateContainer,
    player: PlayerContainer,
    playerBalance: PlayerBalanceContainer,
    paymentWithdrawals: PaymentWithdrawalsContainer,
  },
  withWidth()(SwipeableMenu)
);
