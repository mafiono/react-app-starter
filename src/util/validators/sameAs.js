function sameAs(value, data, fieldName, comparisonField) {
  return value === data[comparisonField];
}

sameAs.message = "This field needs to match the {{comparisonFieldName}}.";
sameAs.args = ["comparisonField", "comparisonFieldName"];

export { sameAs };
