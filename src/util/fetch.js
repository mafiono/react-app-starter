import axios from "axios";
import { inBrowser } from "./functions";

function fetch(url, options = {}) {
  return axios(fetch.resolveOptions(url, options));
}

fetch.resolveOptions = (url, options) => {
  if (typeof url === "string") {
    options.url = url;

    return options;
  } else {
    // url is the options object
    return url;
  }
};

function apiFetch(url, options = {}) {
  options = {
    baseURL: process.env.REACT_APP_BACKEND_API_URL,
    ...options,
    url,
  };

  if (!options.headers) {
    options.headers = {
      "api-key": process.env.REACT_APP_BACKEND_API_KEY,
    };
  } else if (!options.headers.hasOwnProperty("api-key")) {
    options.headers["api-key"] = process.env.REACT_APP_BACKEND_API_KEY;
  }

  let anonKey = null;
  let playerKey = null;

  if (inBrowser) {
    anonKey = window.anonKey;
    playerKey = window.playerKey;
  } else {
    anonKey = global.anonKey;
  }

  if (anonKey && !options.headers.hasOwnProperty("x-anon-session")) {
    options.headers["x-anon-session"] = anonKey;
  }

  if (playerKey && !options.headers.hasOwnProperty("x-player-session")) {
    options.headers["x-player-session"] = playerKey;
  }

  options.headers["x-language"] = "en_EN";

  return fetch(options);
}

apiFetch.get = function (url, options = {}) {
  return apiFetch(url, { ...options, method: "get" });
};

apiFetch.post = function (url, options = {}) {
  return apiFetch(url, { ...options, method: "post" });
};

export { fetch, apiFetch };
