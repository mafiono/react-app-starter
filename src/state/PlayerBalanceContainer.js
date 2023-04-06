import { BaseContainer } from ".";
import { apiFetch } from "../util";

class PlayerBalanceContainer extends BaseContainer {
  static initialState() {
    return {
      balance: undefined, // ie 25.3
      bonus: undefined, // ie. 0
      status: undefined, // ie. 'VALIDATED'
    };
  }

  static fetch() {
    return apiFetch("player/balance");
  }

  loaded() {
    return this.state.balance !== undefined;
  }

  errorResponse() {
    return this.state.balance === null;
  }

  valuesLoaded() {
    return this.loaded() && !this.errorResponse();
  }

  hasBonus() {
    const { bonus } = this.state;

    return typeof bonus === "number" && !isNaN(bonus) && bonus > 0;
  }

  handleResponse = (response) => {
    if (!response || !response.info || !response.info.success) {
      this.setState({
        balance: null,
        bonus: null,
        status: null,
      });

      return;
    }

    this.setState({
      balance: parseFloat(response.data.balance.replace(/,/gi, ""), 10),
      bonus: parseFloat(response.data.bonus.replace(/,/gi, ""), 10),
      status: response.data.status,
    });
  };
}

export default PlayerBalanceContainer;
