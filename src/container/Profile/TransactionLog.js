import React from "react";
import { Paper, Typography, Button, Grid } from "@material-ui/core";
import Helmet from "react-helmet-async";

import TransactionHistory from "../../component/profile/TransactionHistory";
import {
  PlayerBalanceContainer,
  subscribeTo,
  PlayerContainer,
  PaymentWithdrawalsContainer,
} from "../../state";
import { formatCurrency } from "../../util";
import { VerticalPadder } from "../../component/styled";

class TransactionLog extends React.PureComponent {
  componentDidMount() {
    const { paymentWithdrawals } = this.props;

    if (!paymentWithdrawals.loading()) {
      paymentWithdrawals.fetch(true);
    }
  }

  render() {
    let { balance, loading } = this.props.balance.state;
    const { currencySymbol } = this.props.player.state.player;

    if (loading) {
      balance = "Loading balance...";
    } else {
      balance = currencySymbol + " " + formatCurrency(balance);
    }

    const { paymentWithdrawals } = this.props;
    let pendingWdString = "none";
    let pendingWdIds = [];

    if (paymentWithdrawals.loading()) {
      pendingWdString = "...";
    } else if (paymentWithdrawals.hasPending()) {
      pendingWdString =
        currencySymbol + " " + formatCurrency(paymentWithdrawals.state.amount);
    }

    if (paymentWithdrawals.hasPending()) {
      pendingWdIds = paymentWithdrawals.state.transactions;
    }

    return (
      <>
        <VerticalPadder>
          <Helmet>
            <title>Transaction log and balance</title>
          </Helmet>
          <Paper>
            <VerticalPadder top={1} bottom={1}>
              <Grid container alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography align="center" component="p" variant="h6">
                    Current balance
                  </Typography>
                  <Typography align="center" component="p" variant="h4">
                    {balance}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    align="center"
                    component="p"
                    variant="subtitle1"
                    paragraph
                  >
                    Pending withdrawals: {pendingWdString}
                  </Typography>
                  <Typography align="center" component="p" paragraph>
                    <Button
                      onClick={paymentWithdrawals.fetch}
                      disabled={paymentWithdrawals.loading()}
                      color="primary"
                      variant="contained"
                    >
                      Refresh pending WD
                    </Button>
                  </Typography>
                </Grid>
              </Grid>
            </VerticalPadder>
          </Paper>
          <TransactionHistory
            pendingWdIds={pendingWdIds}
            paymentWithdrawals={paymentWithdrawals}
          />
        </VerticalPadder>
      </>
    );
  }
}

export default subscribeTo(
  {
    balance: PlayerBalanceContainer,
    player: PlayerContainer,
    paymentWithdrawals: PaymentWithdrawalsContainer,
  },
  TransactionLog
);
