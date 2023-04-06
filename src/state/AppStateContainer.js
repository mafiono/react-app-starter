import { BaseContainer } from ".";
import { hideTawkWidget, showTawkWidget } from "../util";

class AppStateContainer extends BaseContainer {
  static initialState() {
    return {
      isMobile: undefined,
      showMobileMenu: false,
      showLogin: false,
      gameId: null,
      showSuccessfulLoginMessage: false,
      aAid: null,
      aBid: null,
    };
  }

  constructor(isMobile, aAid, aBid) {
    super();

    this._isMobile = isMobile;
    this.state.isMobile = isMobile;
    this.state.aAid = aAid;
    this.state.aBid = aBid;
  }

  reset = (override = {}) => {
    super.reset({
      isMobile: this._isMobile,
      ...override,
    });
  };

  hideNavigation = () => {
    this.setState({ showMobileMenu: false });
    showTawkWidget();
  };

  showNavigation = () => {
    this.setState({ showMobileMenu: true });
    hideTawkWidget();
  };

  hideLogin = () => {
    this.setState({ showLogin: false });
    showTawkWidget();
  };

  showLogin = () => {
    this.setState({ showLogin: true });
    hideTawkWidget();
  };

  setGameId = (gameId) => {
    this.setState({ gameId });
    hideTawkWidget();
  };

  unsetGameId = () => {
    this.setState({ gameId: null });
    showTawkWidget();
  };

  flashLoginMessage = () => {
    this.setState({ showSuccessfulLoginMessage: true }, () =>
      setTimeout(this.hideLoginMessage, 5000)
    );
  };

  hideLoginMessage = () => {
    this.setState({ showSuccessfulLoginMessage: false });
  };
}

export default AppStateContainer;
