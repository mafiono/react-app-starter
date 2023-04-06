function max(value, data, fieldName, max) {
  value = parseFloat(value, 10);
  max = parseFloat(max, 10);

  return typeof value === "number" && !isNaN(value) && value <= max;
}

max.message = "Can't be bigger than {{max}}.";
max.args = ["max"];

export { max };
