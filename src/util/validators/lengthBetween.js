function lengthBetween(value, data, fieldName, min, max) {
  if (typeof value !== "string" || value.length === 0) {
    return true;
  }

  return value.length >= min && value.length <= max;
}

lengthBetween.message =
  "Please specify between {{min}} and {{max}} characters.";
lengthBetween.args = ["min", "max"];

export { lengthBetween };
