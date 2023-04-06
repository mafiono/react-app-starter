import { DataValidator } from ".";
import { getCaseInsensitiveProperty } from "./functions";

let externalScriptIndex = 0;

export function validatorFromApiFields(fields) {
  const definition = {};
  const scripts = [];

  fields.forEach((field) => {
    if (field.fieldType === "hidden") {
      if (
        field.hasOwnProperty("encryption") &&
        field.encryption.hasOwnProperty("src")
      ) {
        const { src, function: method } = field.encryption;
        const scriptId = "paymentExternal_" + externalScriptIndex++;
        const script = document.createElement("script");

        script.id = scriptId;
        script.src = src;

        document.head.appendChild(script);

        scripts.push({
          id: scriptId,
          method,
        });
      }
    } else {
      const validators = [];
      const messages = [];

      if (field.required) {
        validators.push("required");
        messages.push(field.name + " is required.");
      }

      switch (field.type) {
        case "number":
          if (field.min) {
            validators.push("min:" + field.min);
          }
          if (field.max) {
            validators.push("max:" + field.max);
          }
          break;
        case "string":
          if (field.maxLength) {
            validators.push("maxLength:" + field.maxLength);
          }
          if (field.minLength) {
            validators.push("minLength:" + field.minLength);
          }
          break;
        default:
      }

      definition[field.code] = {
        validators,
        messages,
      };
    }
  });

  return {
    instance: new DataValidator(definition),
    scripts,
  };
}

function returnEmptyString() {
  return "";
}

export function removeApiFieldScripts(scripts) {
  scripts.forEach((script) => {
    const tag = document.getElementById(script.id);

    if (tag) {
      tag.parentElement.removeChild(tag);
    }

    window[script.method] = returnEmptyString;
  });
}

export function processApiFields(fields, data) {
  fields.forEach((field) => {
    if (field.fieldType === "hidden") {
      if (
        field.hasOwnProperty("encryption") &&
        field.encryption.hasOwnProperty("function")
      ) {
        const { function: method } = field.encryption;

        if (typeof window[method] !== "function") {
          throw new Error(
            "Still loading validation in background. Try submitting again in a few seconds."
          );
        }

        const valueKeyTester = field.code.substr(3);
        const valueKey = getCaseInsensitiveProperty(data, valueKeyTester);
        data[field.code] = window[method](data[valueKey]);

        return;
      }

      if (field.hasOwnProperty("defaultValue")) {
        data[field.code] = field.defaultValue;
      }

      return;
    }

    if (field.type === "number" && data.hasOwnProperty(field.code)) {
      data[field.code] = parseFloat(data[field.code], 10);

      if (isNaN(data[field.code])) {
        data[field.code] = 0;
      }
    }
  });

  return data;
}

export function sortByPosition(a, b) {
  let aPosition = a.position;
  let bPosition = b.position;

  if (aPosition > bPosition) {
    return -1;
  } else if (aPosition < bPosition) {
    return 1;
  }

  return 0;
}
