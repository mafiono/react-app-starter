import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import styled from "styled-components/macro";
import {
  Grid,
  CircularProgress,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { PaymentMethods, PaymentBonuses } from ".";
import {
  BonusContainer,
  PlayerBalanceContainer,
  CashierMethodsContainer,
  subscribeTo,
} from "../../state";
import { MaxWidth } from "../styled";
import ScrollTopOnMount from "../ScrollTopOnMount";

class PaymentProcess extends React.Component {
  static propTypes = {
    methodType: PropTypes.oneOf(["deposit", "withdrawal"]),
  };

  static defaultProps = {
    methodType: "deposit",
  };

  state = {
    method: null,
    showConfirmation: false,
    bonus: null,
  };

  componentDidMount() {
    this.paymentWindow = null;

    const { bonuses, playerBalance, cashierMethods } = this.props;

    cashierMethods.fetch();
    bonuses.fetch();
    playerBalance.fetch();
  }

  componentDidUpdate(prevProps) {
    const { cashierMethods } = this.props;
    const { cashierMethods: prevCashierMethods } = prevProps;

    if (prevCashierMethods && !cashierMethods) {
      this.setState({ method: null });
    }
  }

  componentWillUnmount() {
    clearInterval(this.windowInterval);

    if (this.paymentWindow !== null && !this.paymentWindow.closed) {
      this.paymentWindow.close();
    }
  }

  render = () => {
    const { methodType } = this.props;
    const { method } = this.state;

    return (
      <MaxWidth>
        <Header>
          {methodType === "deposit" && method && (
            <IconButton onClick={this.stepBack}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <HeaderTitle component="p" variant="subtitle1">
            {this.renderTitle()}
          </HeaderTitle>
        </Header>
        {this.renderContent()}
      </MaxWidth>
    );
  };

  renderTitle() {
    const {
      methodType,
      bonuses: bonusesProp,
      cashierMethods: cashierMethodsProp,
    } = this.props;
    const { bonuses } = bonusesProp.state;

    const isDeposit = methodType === "deposit";
    const { method } = this.state;

    if (isDeposit && method) {
      if (!bonuses) {
        return `Loading bonuses...`;
      }

      return `Choose bonus and deposit with ${method.name}`;
    }

    if (cashierMethodsProp.loading()) {
      return `Loading ${isDeposit ? "deposit" : "withdrawal"} methods...`;
    }

    return `Select ${isDeposit ? "deposit" : "withdrawal"} method`;
  }

  renderContent() {
    const { method, showConfirmation } = this.state;
    const {
      methodType,
      cashierMethods: cashierMethodsProp,
      bonuses: bonusesProp,
    } = this.props;
    const { bonuses } = bonusesProp.state;
    const isDeposit = methodType === "deposit";

    if (showConfirmation) {
      let bonusMessage = null;
      const { bonus } = this.state;

      if (bonus) {
        bonusMessage = bonus.message;
      }

      return (
        <>
          <ScrollTopOnMount key="confirmation" />
          <Typography align="center" variant="h5" component="p" paragraph>
            All set...
          </Typography>
          {bonusMessage && (
            <Typography
              align="center"
              component="p"
              paragraph
              dangerouslySetInnerHTML={{ __html: bonusMessage }}
            />
          )}
          <Typography align="center" component="p" paragraph>
            You can now continue with your deposit with {method.name}.
          </Typography>
          <Typography align="center">
            <Button
              onClick={this.initPayment}
              color="primary"
              variant="contained"
            >
              Deposit with {method.name}
            </Button>
          </Typography>
        </>
      );
    }

    if (
      (!method && !cashierMethodsProp.valuesLoaded()) ||
      (isDeposit && method && !Array.isArray(bonuses))
    ) {
      return (
        <Grid container key="loading" justify="center">
          <CircularProgress />
        </Grid>
      );
    }

    let cashierMethods = null;

    if (methodType === "deposit") {
      if (method) {
        return (
          <>
            <ScrollTopOnMount key="bonuses" />
            <PaymentBonuses
              onBonusSelected={this.onBonusSet}
              bonuses={bonuses}
              method={method}
            />
          </>
        );
      }

      cashierMethods = cashierMethodsProp.state.deposit;
    } else {
      cashierMethods = cashierMethodsProp.state.withdrawal;
    }

    return (
      <>
        <ScrollTopOnMount key="list" />
        <PaymentMethods
          onMethodSelected={this.setMethod}
          cashierMethods={cashierMethods}
          actionText={methodType === "deposit" ? "Deposit" : "Withdraw"}
          method={method}
        />
      </>
    );
  }

  onBonusSet = (bonus) => {
    this.setState({ showConfirmation: true, bonus });
  };

  initPayment = () => {
    const { methodType } = this.props;
    const { method } = this.state;

    if (this.paymentWindow !== null) {
      this.paymentWindow.close();
    }

    window.paymentPropInjection = () => {
      window.paymentPropInjection = undefined;

      return {
        method,
        methodType,
      };
    };

    window.registerPaymentInteraction = ({ method: paymentMethod, type }) => {
      if (paymentMethod.code === method.code && type === methodType) {
        window.registerPaymentInteraction = undefined;
        this.redirectOnPaymentClose = true;
      }
    };

    this.paymentWindow = window.open(
      "/payment",
      methodType + method.code,
      "dependent=1,personalbar=0,location=0,toolbar=0,menubar=0,height=600,width=500"
    );

    if (!this.windowInterval) {
      this.windowInterval = setInterval(this.handleWindowClose, 500);
    }
  };

  handleWindowClose = () => {
    if (this.paymentWindow === null) {
      return;
    }

    if (this.paymentWindow.closed) {
      this.paymentWindow = null;
      this.handlePaymentComplete();
    }
  };

  setMethod = (method) => {
    const { methodType } = this.props;

    this.setState({ method }, () => {
      if (methodType === "withdrawal") {
        this.initPayment();
      }
    });
  };

  stepBack = () => {
    const { showConfirmation } = this.state;

    if (showConfirmation) {
      this.setState({ showConfirmation: false, bonus: null });
      return;
    }

    this.setState({ method: null });
  };

  handlePaymentComplete = () => {
    const { history, playerBalance } = this.props;

    playerBalance.fetch();

    if (this.redirectOnPaymentClose) {
      history.push("/profile/transaction-log");
    }
  };
}

const Header = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: ${(p) => p.theme.spacing(2)}px;
`;

const HeaderTitle = styled(Typography)`
	margin-left: ${(p) => p.theme.spacing(2)}px;
`;

export default withRouter(
  subscribeTo(
    {
      bonuses: BonusContainer,
      playerBalance: PlayerBalanceContainer,
      cashierMethods: CashierMethodsContainer,
    },
    PaymentProcess
  )
);
