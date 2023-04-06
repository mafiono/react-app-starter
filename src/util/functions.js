// https://stackoverflow.com/a/46181
export function validateEmail(email) {
  var re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function getFormData(formElement) {
  const formData = new FormData(formElement);
  const data = {};

  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }

  return data;
}

export function generateUniquePattern(check, base = "", iteration = 0) {
  if (base.length > 0 && check.indexOf(base) === -1) {
    return base;
  }

  const convertToString = Math.random() >= 0.5;

  if (convertToString) {
    base += String.fromCharCode(97 + iteration);
  } else {
    base += iteration;
  }

  return generateUniquePattern(check, base, iteration + 1);
}

export function objectPropertyOrFallback(
  object,
  property,
  fallback = undefined
) {
  if (!object || !object.hasOwnProperty || !property) {
    return fallback;
  }

  return object.hasOwnProperty(property) ? object[property] : fallback;
}

export function cloneClass(orig) {
  if (!orig) {
    return orig;
  }

  return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
}

export function isMobileBrowser() {
  if (navigator.userAgent.match(/Mobi/)) {
    return true;
  }

  if ("screen" in window && window.screen.width < 1366) {
    return true;
  }

  var connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  if (connection && connection.type === "cellular") {
    return true;
  }

  return false;
}

export function getCaseInsensitiveProperty(object, property) {
  const lowercaseProperty = property.toLowerCase();

  for (const key of Object.keys(object)) {
    if (key.toLowerCase() === lowercaseProperty) {
      return key;
    }
  }

  return null;
}

export const inBrowser = typeof window === "object";

const slashesRegExp = new RegExp("^/+");

export function canonicalize(url) {
  url = typeof url === "string" ? url : "";

  return process.env.REACT_APP_BASE_URL + url.replace(slashesRegExp, "");
}
