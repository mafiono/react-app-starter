import { Container } from "unstated";
import { fetch } from "../util";

class RequestContainer extends Container {
  constructor({ apiBackend, apiKey, anonKey = null, playerKey = null }) {
    super();

    this.apiBackend = apiBackend;
    this.apiKey = apiKey;
    this.anonKey = anonKey;
    this.playerKey = playerKey;

    this.reset();
  }

  fetch(url, options = {}) {
    options = fetch.resolveOptions(url, options);

    const { morphResponse, cacheKey, ...fetchOptions } = options;

    if (cacheKey && this.responseCache.has(cacheKey)) {
      return Promise.resolve(this.responseCache.get(cacheKey));
    }

    const request = fetch(fetchOptions).then((requestResponse) => {
      if (typeof morphResponse === "function") {
        requestResponse = morphResponse(requestResponse);
      }

      if (cacheKey) {
        this.responseCache.set(cacheKey, requestResponse);
      }

      return requestResponse;
    });

    this.requested.push(request);

    return request;
  }

  apiFetch(url, options = {}) {
    options = {
      baseURL: this.apiBackend,
      ...options,
    };

    if (!options.headers) {
      options.headers = {
        "api-key": this.apiKey,
      };
    } else if (!options.headers.hasOwnProperty("api-key")) {
      options.headers["api-key"] = this.apiKey;
    }

    if (this.anonKey && !options.headers.hasOwnProperty("x-anon-session")) {
      options.headers["x-anon-session"] = this.anonKey;
    }

    if (this.playerKey && !options.headers.hasOwnProperty("x-player-session")) {
      options.headers["x-player-session"] = this.playerKey;
    }

    return this.fetch(url, options);
  }

  apiGet = (url, options = {}) => {
    return this.fetch(url, { ...options, method: "get" });
  };

  apiPost = (url, options = {}) => {
    return this.fetch(url, { ...options, method: "post" });
  };

  setPlayerKey = (playerKey = null) => {
    this.playerKey = playerKey;

    // TODO callback api for when values get updated.
    // it should execute every callback when the value changes.

    return this;
  };

  reset = () => {
    this.responseCache = new Map();
    this.requested = [];

    return this;
  };

  all = () => {
    return Promise.all(this.requested);
  };

  hasCached = (cacheKey) => {
    return this.responseCache.has(cacheKey);
  };

  getCached = (cacheKey) => {
    return this.responseCache.get(cacheKey);
  };
}

export default RequestContainer;
