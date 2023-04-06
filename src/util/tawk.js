import { inBrowser } from "./";

export function hideTawkWidget() {
  if (!inBrowser) {
    return;
  }

  const { Tawk_API } = window;

  if (Tawk_API) {
    Tawk_API.hideWidget();
  }
}

export function showTawkWidget() {
  if (!inBrowser) {
    return;
  }

  const { Tawk_API } = window;

  if (Tawk_API) {
    Tawk_API.showWidget();
  }
}

export function showTawkChat() {
  if (!inBrowser) {
    return;
  }

  showTawkWidget();

  const { Tawk_API } = window;

  if (Tawk_API) {
    Tawk_API.maximize();
  }
}
