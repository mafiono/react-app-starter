function required(value) {
  return !(
    value === undefined ||
    value === null ||
    value === "" ||
    (typeof value === "number" && isNaN(value))
  );
}

required.message = "Please specify {{subject}}.";
required.args = ["subject"];

export { required };
