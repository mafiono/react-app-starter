function min(value, data, fieldName, min) {
  value = parseFloat(value, 10);
  min = parseFloat(min, 10);

  return typeof value === "number" && !isNaN(value) && value >= min;
}

min.message = "Must be at least {{min}}.";
min.args = ["min"];

export { min };
