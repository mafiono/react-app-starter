import Cookies from "js-cookie";
import md5 from "md5";

import { BaseContainer } from ".";
import { apiFetch, inBrowser } from "../util";

function doLogout() {
  Cookies.remove("playerKey");
  Cookies.remove("anonKey");
}

class PlayerContainer extends BaseContainer {
  loggedOut = false;

  constructor() {
    super();

    this.inBrowser = inBrowser;

    const { anonKey, playerKey } = this.state;

    if (!anonKey) {
      apiFetch("anon")
        .then((response) => {
          const newState = { anonKey: response.data.data.sessionid };

          Cookies.set("anonKey", newState.anonKey);

          if (this.inBrowser) {
            window.anonKey = newState.anonKey;
          }

          this.setState(newState);
        })
        .catch(() => this.setState({ anonKey: null })); // TODO sentry
    } else if (playerKey) {
      apiFetch("player")
        .then((response) => {
          const player = response.data.data;

          this.setPlayer(player, false);
        })
        .catch((error) => {
          if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.info
          ) {
            const { resultCode } = error.response.data.info;

            if (resultCode === "session_expired") {
              this.setPlayer(null, true);
            } else {
              // TODO sentry
            }
          }
        });
    }
  }

  static initialState() {
    let anonKey = undefined;
    let playerKey = null;

    if (inBrowser) {
      anonKey = Cookies.get("anonKey");
      playerKey = Cookies.get("playerKey");
    } else {
      // intentional fake key for SSR
      anonKey = "vL3K7SIdZGcBtlO6shfiaJDTkUxjEo1R81111";
    }

    if (!anonKey) {
      anonKey = undefined;
      playerKey = null;
    } else if (!playerKey) {
      playerKey = null;
    }

    if (inBrowser) {
      window.anonKey = anonKey;
      window.playerKey = playerKey;
    }

    return {
      anonKey,
      playerKey,
      player: null,
    };
  }

  loaded() {
    return !!this.state.anonKey;
  }

  loggedIn = () => {
    return !!this.state.player;
  };

  setPlayer = (player, remember = false, callback) => {
    let playerKey = null;

    if (player) {
      playerKey = player.sessionid;
      player.emailHash = md5(player.email);
      player.currencySymbol = player.currencycode === "EUR" ? "€" : "";
    }

    if (remember) {
      if (playerKey) {
        Cookies.set("anonKey", this.state.anonKey, { expires: 7 });
        Cookies.set("playerKey", playerKey, { expires: 7 });
      } else {
        Cookies.remove("playerKey");
      }
    } else {
      if (playerKey) {
        Cookies.set("playerKey", playerKey);
      }
    }

    if (this.inBrowser) {
      window.playerKey = playerKey;
    }

    this.loggedOut = false;

    this.setState({ player, playerKey }, callback);
  };

  logout = () => {
    if (this.loggedOut) {
      return Promise.resolve();
    }

    this.loggedOut = true;

    return apiFetch("player/logout").then(doLogout).catch(doLogout);
  };
}

export default PlayerContainer;
