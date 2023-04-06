function matchRegex(value, data, fieldName, regexp, flags) {
  if (!value) {
    return true;
  }

  const validationRegexp = new RegExp(regexp, flags);
  return validationRegexp.test(value);
}

matchRegex.message = "Field doesn't match test.";

export { matchRegex };
