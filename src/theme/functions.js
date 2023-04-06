export function searchForColor(object, path = []) {
  let listedColors = [];

  for (const key of Object.keys(object)) {
    const value = object[key];
    const localPath = path.slice();
    localPath.push(key);

    const valueType = typeof value;

    if (valueType === "string") {
      listedColors.push({
        path: localPath,
        value,
      });
    } else if (valueType === "object") {
      searchForColor(value, localPath).forEach((color) => {
        listedColors.push(color);
      });
    }
  }

  return listedColors;
}

export function returnStyles(styles, theme) {
  return typeof styles === "function" ? styles(theme) : styles;
}
