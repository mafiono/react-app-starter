import { generateUniquePattern } from ".";

function escape(string, token) {
  let pattern = null;

  if (string.indexOf(token) !== -1) {
    pattern = generateUniquePattern(string);

    string = string.split(token).join(pattern);
  }

  return { string, pattern };
}

function unescape(string, pattern, escapee) {
  if (pattern !== null) {
    string = string.split(pattern).join(escapee);
  }

  return string;
}

class StringEscapeResolver {
  constructor(escapee, escapeString = "\\") {
    this.escapee = escapee;
    this.escapeString = escapeString;
    this.escapePattern = null;
    this.tokenPattern = null;
  }

  escape(string) {
    const escapedEscape = escape(string, this.escapeString + this.escapeString);
    this.escapePattern = escapedEscape.pattern;

    const tokenEscape = escape(
      escapedEscape.string,
      this.escapeString + this.escapee
    );
    this.tokenPattern = tokenEscape.pattern;

    return tokenEscape.string;
  }

  unescape(string) {
    string = unescape(string, this.tokenPattern, this.escapee);
    string = unescape(string, this.escapePattern, this.escapeString);

    return string;
  }
}

export default StringEscapeResolver;
