import React from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import styled from "styled-components/macro";

import { formatCurrency } from "../../util";
import {
  subscribeTo,
  PlayerBalanceContainer,
  PlayerContainer,
} from "../../state";
import { Button } from "../ui";

class Balance extends React.Component {
  render() {
    const { playerBalance } = this.props;

    if (playerBalance.errorResponse()) {
      // TODO error view?
      return null;
    }

    const loading = playerBalance.loading();

    return (
      <StyledButton
        size="small"
        variant="text"
        color={loading ? "secondary" : "primary"}
        disableRipple
        onClick={this.handleClick}
        tooltip={loading ? "Refreshing balance..." : "Refresh balance"}
        aria-label="Balance"
      >
        {this.renderText()}
        <RefreshIcon />
      </StyledButton>
    );
  }

  renderText() {
    const { playerBalance, player } = this.props;

    if (!playerBalance.valuesLoaded()) {
      return "...";
    }

    const { balance, bonus } = playerBalance.state;
    const { currencySymbol } = player.state.player;

    let text = `${currencySymbol} ${formatCurrency(balance)}`;

    if (playerBalance.hasBonus()) {
      text += ` + ${formatCurrency(bonus)}`;
    }

    return text;
  }

  handleClick = () => {
    const { playerBalance } = this.props;

    if (playerBalance.loading()) {
      return;
    }

    playerBalance.fetch(true);
  };
}

const StyledButton = styled(Button)`
	white-space: nowrap;
	${(p) => (p.color === "secondary" ? "color: #cabaa0;" : "")}
`;

export default subscribeTo(
  {
    playerBalance: PlayerBalanceContainer,
    player: PlayerContainer,
  },
  Balance
);
