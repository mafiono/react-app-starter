function maxLength(value, data, fieldName, max) {
  if (typeof value !== "string") {
    return true;
  }

  return value.length <= max;
}

maxLength.message = "Please specify a maximum of {{max}} characters.";
maxLength.args = ["max"];

export { maxLength };
