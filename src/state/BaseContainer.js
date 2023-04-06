import { Container } from "unstated";

class BaseContainer extends Container {
  static initialState(state) {
    state.loading = false;

    return state;
  }

  constructor() {
    super();

    this.state = BaseContainer.initialState(this.constructor.initialState());
  }

  reset = (override = {}) => {
    this.setState({
      ...BaseContainer.initialState(this.constructor.initialState()),
      ...override,
    });
  };

  loading = () => {
    return this.state.loading;
  };

  fetch = (force = false) => {
    if (this.loading()) {
      return this;
    }

    if (!force && this.loaded && this.loaded()) {
      return this;
    }

    this.setState({ loading: true }, this.doFetch);
    return this;
  };

  doFetch = () => {
    this.constructor.fetch().then(this.processFetch).catch(this.processError);
  };

  processFetch = (response) => {
    this.setState({ loading: false });

    if (!response || !response.data) {
      return;
    }

    this.handleResponse(response.data);
  };

  processError = (error) => {
    this.processFetch(error.response);
  };
}

export default BaseContainer;
