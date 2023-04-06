function minLength(value, data, fieldName, min) {
  return typeof value === "string" && value.length >= min;
}

minLength.message = "Please specify at least {{min}} characters.";
minLength.args = ["min"];

export { minLength };
