import { objectPropertyOrFallback } from "../../util";

export default class BaseModel {
  constructor(data = null) {
    if (data !== null && this.constructor && this.constructor.propertyMap) {
      const map = this.constructor.propertyMap;

      for (const key of Object.keys(map)) {
        const value = map[key];

        if (value === null) {
          this[key] = objectPropertyOrFallback(data, key);
          continue;
        }

        switch (typeof value) {
          case "string":
            this[key] = objectPropertyOrFallback(data, value);
            break;

          case "function":
            this[key] = value(data);
            break;

          default:
        }
      }
    }
  }
}
