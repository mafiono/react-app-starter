import React from "react";
import styled from "styled-components/macro";
import { Route, Switch } from "react-router-dom";
import { Tabs, Tab } from "@material-ui/core";

import { Settings, TransactionLog, GameLog, Restrictions, BonusHistory } from "./Profile/";
import { isAuthorized } from "../component/hoc";
import { ScrollTopOnMount } from "../component";

class Profile extends React.PureComponent {
  render() {
    let { page } = this.props.match.params;

    if (!page) {
      page = "settings";
    }

    return (
      <>
        <ScrollTopOnMount />
        <StyledTabs
          value={page}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          scrollButtons="auto"
          variant="scrollable"
        >
          <Tab value="settings" label="Settings" />
          <Tab value="transaction-log" label="Transaction log" />
          <Tab value="game-log" label="Game log" />
          <Tab value="bonus-history" label="Bonus history" />
          <Tab value="restrictions" label="Restrictions" />
        </StyledTabs>
        <Switch>
          <Route path="/profile" exact component={Settings} />
          <Route path="/profile/transaction-log" component={TransactionLog} />
          <Route path="/profile/game-log" component={GameLog} />
          <Route path="/profile/bonus-history" component={BonusHistory} />
          <Route path="/profile/restrictions" component={Restrictions} />
        </Switch>
      </>
    );
  }

  handleTabChange = (ev, page) => {
    const { history } = this.props;

    if (page === "settings") {
      page = "/profile";
    } else {
      page = "/profile/" + page;
    }

    history.push(page);
  };
}

const StyledTabs = styled(Tabs)`
	margin-bottom: 2em;
`;

export default isAuthorized(Profile);
