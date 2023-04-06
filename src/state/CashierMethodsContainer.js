import { BaseContainer } from ".";
import { apiFetch } from "../util";

class CashierMethodsContainer extends BaseContainer {
  static initialState() {
    return {
      deposit: undefined,
      withdrawal: undefined,
    };
  }

  static fetch() {
    return apiFetch("player/cashier/both");
  }

  loaded() {
    return this.state.deposit !== undefined;
  }

  errorResponse() {
    return this.state.deposit === null;
  }

  valuesLoaded() {
    return this.loaded() && !this.errorResponse();
  }

  handleResponse = (response) => {
    if (!response || !response.info || !response.info.success) {
      this.setState({
        deposit: null,
        withdrawal: null,
      });

      // TODO sentry error

      return;
    }

    const newState = {
      deposit: [],
      withdrawal: [],
    };

    if (response && response.data) {
      if (Array.isArray(response.data.deposit_methods)) {
        for (const deposit of response.data.deposit_methods) {
          newState.deposit.push(deposit);
        }
      }

      if (Array.isArray(response.data.withdrawal_methods)) {
        for (const withdrawal of response.data.withdrawal_methods) {
          newState.withdrawal.push(withdrawal);
        }
      }
    }

    this.setState(newState);
  };
}

export default CashierMethodsContainer;
