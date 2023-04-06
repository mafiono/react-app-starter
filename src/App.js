import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import { CssBaseline, Fade } from "@material-ui/core";
import styled, { ThemeProvider } from "styled-components/macro";
import deepmerge from "deepmerge";
import { Provider, Subscribe } from "unstated";
import DateFnsUtils from "@date-io/date-fns";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import Helmet from "react-helmet-async";
import GoogleFontLoader from "react-google-font-loader";

import {
  Login,
  Header,
  Footer,
  SwipeableMenu,
  GameOverlay,
  Notification,
} from "./component";
import { muiThemeCommon, defaultMuiThemeColors } from "./theme";
import { PaymentModule } from "./submodule/Payment";
import {
  PlayerContainer,
  PlayerBalanceContainer,
  AppStateContainer,
  PaymentWithdrawalsContainer,
} from "./state";
import { inBrowser } from "./util";
import Home from "./container/Home";
import SignUp from "./container/SignUp";
import Profile from "./container/Profile";
import LiveCasino from "./container/LiveCasino";
import BlogNews from "./container/BlogNews";
import Promotions from "./container/Promotions";
import VirtualSports from "./container/VirtualSports";
import Casino from "./container/Casino";
import Vip from "./container/Vip";
import AboutUs from "./container/AboutUs";
import Affiliates from "./container/Affiliates";
import Help from "./container/Help";
import Cashier from "./container/Cashier";
import Logout from "./container/Logout";
import PasswordRecovery from "./container/PasswordRecovery";
import ResetPassword from "./container/ResetPassword";
import Search from "./container/Search";
import ConfirmSignUp from "./container/ConfirmSignUp";
import NotFound from "./container/NotFound";

class App extends React.Component {
  constructor(props) {
    super(props);

    const muiTheme =
      props.muiTheme ||
      createMuiTheme(deepmerge(defaultMuiThemeColors, muiThemeCommon));

    this.styledComponentsTheme = {
      mui: muiTheme,
      createTransition: (
        props = "all",
        duration = "short",
        easing = "easeOut",
        delay = 0
      ) => {
        return muiTheme.transitions.create(props, {
          duration:
            typeof duration === "string"
              ? muiTheme.transitions.duration[duration]
              : duration,
          easing:
            typeof easing === "string"
              ? muiTheme.transitions.easing[easing]
              : easing,
          delay,
        });
      },
      spacing: (factor = 1) => {
        return muiTheme.spacing.unit * factor;
      },
      pxToRem: muiTheme.typography.pxToRem,
    };

    this.playerInitialized = false;
    this.subscribeTo = [
      PlayerContainer,
      AppStateContainer,
      PlayerBalanceContainer,
      PaymentWithdrawalsContainer,
    ];

    const { isMobile, aAid, aBid } = props;
    const appState = new AppStateContainer(isMobile, aAid, aBid);

    this.providedState = [appState];
  }

  render() {
    return (
      <Provider inject={this.providedState}>
        <Subscribe to={this.subscribeTo}>{this.renderApp}</Subscribe>
      </Provider>
    );
  }

  renderApp = (playerData, appState, balance, paymentWithdrawals) => {
    const { anonKey, player, playerKey } = playerData.state;

    if (inBrowser) {
      if (anonKey === null) {
        playerData.logout();

        window.location.replace("/");

        return null;
      }

      if (!anonKey || (playerKey && !player)) {
        return null;
      }
    }

    if (player && !this.playerInitialized) {
      this.playerInitialized = true;

      balance.fetch();
      paymentWithdrawals.fetch();
    }

    const routes = this.renderRoutes(playerData, appState);

    return (
      <>
        <GoogleFontLoader
          fonts={[
            {
              font: "Montserrat",
              weights: [400, 500, 600, 700, 800, 900],
            },
          ]}
        />
        <CssBaseline />
        <ThemeProvider theme={this.styledComponentsTheme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Helmet>
              <title>BETBTC</title>
              <meta name="description" content="Online Casino && Sports Betting With Amazing Bonuses " />
            </Helmet>
            {inBrowser ? <Router>{routes}</Router> : routes}
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </>
    );
  };

  renderRoutes = (playerData, appState) => {
    const { player } = playerData.state;
    return (
      <Switch>
        <Route path="/payment" component={PaymentModule} />
        <Route>
          <AppWrapper>
            <GameOverlay
              onClose={appState.unsetGameId}
              gameId={appState.state.gameId}
            />
            <Login />
            <SwipeableMenu />
            <Header />
            <ContentWrapper>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/sign-up/:refCode?" component={SignUp} />
                <Route path="/profile/:page?" component={Profile} />
                <Route
                  path="/live-casino/:providerId?"
                  component={LiveCasino}
                />
                <Route path="/blog-news/:article?" component={BlogNews} />
                <Route path="/promotions/:promotion?" component={Promotions} />
                <Route path="/virtual-sports" component={VirtualSports} />
                <Route path="/top-casino" component={Casino} />
                <Route path="/vip" component={Vip} />
                <Route path="/about-us" component={AboutUs} />
                <Route path="/affiliates" component={Affiliates} />
                <Route path="/help" component={Help} />
                <Route path="/cashier/:page?" component={Cashier} />
                <Route path="/logout" component={Logout} />
                <Route path="/password-recovery" component={PasswordRecovery} />
                <Route
                  path="/reset-password/:token"
                  component={ResetPassword}
                />
                <Route path="/search" component={Search} />
                <Route
                  path="/auth/register_via_token"
                  component={ConfirmSignUp}
                />
                <Route component={NotFound} />
              </Switch>
            </ContentWrapper>
            <Footer />
            {playerData.loggedIn() && (
              <Notification
                open={appState.state.showSuccessfulLoginMessage}
                onClose={appState.hideLoginMessage}
                TransitionComponent={Fade}
                message={`Logged in as ${player.username}`}
              />
            )}
          </AppWrapper>
        </Route>
      </Switch>
    );
  };
}

const AppWrapper = styled.div`
	max-width: 120em;
	width: 100%;
	position: relative;
	transition: transform .2s ease;
	box-shadow: 0 0 ${(p) => p.theme.mui.spacing.unit * 2}px rgba(0, 0, 0, .8);
	margin: 0 auto;
	padding: 0;
`;

const ContentWrapper = styled.div`
	padding: 0 ${(p) => p.theme.mui.spacing.unit * 2}px;

	${(p) => p.theme.mui.breakpoints.down("sm")} {
		padding-right: ${(p) => p.theme.mui.spacing.unit * 1}px;
		padding-left: ${(p) => p.theme.mui.spacing.unit * 1}px;
	}
`;

export default App;
