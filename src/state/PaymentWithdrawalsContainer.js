import { BaseContainer } from ".";
import { apiFetch } from "../util";

class PaymentWithdrawalsContainer extends BaseContainer {
  static initialState() {
    return {
      transactions: undefined,
      amountStr: "",
      amount: 0,
    };
  }

  static fetch() {
    return apiFetch("player/transactions/pendingWithdrawals");
  }

  loaded() {
    return this.state.transactions !== undefined;
  }

  errorResponse() {
    return this.state.transactions === null;
  }

  valuesLoaded() {
    return this.loaded() && !this.errorResponse();
  }

  hasPending() {
    const { transactions } = this.state;

    return Array.isArray(transactions) && transactions.length > 0;
  }

  handleResponse = (response) => {
    if (
      !response ||
      !response.info ||
      !response.info.success ||
      !response.data ||
      !Array.isArray(response.data.trans_ids)
    ) {
      this.setState({
        transactions: null,
        amountStr: "",
        amount: 0,
      });

      return;
    }

    this.setState({
      transactions: response.data.trans_ids,
      amountStr: response.data.pendingWithdrawalAmountStr || "",
      amount: response.data.pendingWithdrawalAmountVal || 0,
    });
  };
}

export default PaymentWithdrawalsContainer;
