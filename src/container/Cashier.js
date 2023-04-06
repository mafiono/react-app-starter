import React from "react";
import { Route, Switch } from "react-router-dom";
import { Tabs, Tab } from "@material-ui/core";

import { Deposit, Withdraw } from "../component/cashier";
import { isAuthorized } from "../component/hoc";
import { VerticalPadder } from "../component/styled";
import { ScrollTopOnMount } from "../component";

class Cashier extends React.PureComponent {
  render() {
    let { page } = this.props.match.params;

    if (!page) {
      page = "deposit";
    }

    return (
      <>
        <ScrollTopOnMount />
        <Tabs
          value={page}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="deposit" label="Deposit" />
          <Tab value="withdraw" label="Withdraw" />
        </Tabs>
        <Switch>
          <VerticalPadder>
            <Route path="/cashier" exact component={Deposit} />
            <Route path="/cashier/withdraw" component={Withdraw} />
          </VerticalPadder>
        </Switch>
      </>
    );
  }

  handleTabChange = (ev, page) => {
    const { history } = this.props;

    if (page === "deposit") {
      page = "/cashier";
    } else {
      page = "/cashier/" + page;
    }

    history.push(page);
  };
}

export default isAuthorized(Cashier);
