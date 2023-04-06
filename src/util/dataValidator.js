//import { required, maxLength, minLength, sameAs, matchRegex, email, lengthBetween, min, max } from "./validators";

import { StringEscapeResolver } from "../util";
import {email} from "./validators/email";
import {lengthBetween} from "./validators/lengthBetween";
import {matchRegex} from "./validators/matchRegex";
//import {max, min} from "date-fns";
import {maxLength} from "./validators/maxLength";
import {minLength} from "./validators/minLength";
import {required} from "./validators/required";
import {sameAs} from "./validators/sameAs";
import {max} from "./validators/max";
import {min} from "./validators/min";

class ValidatorMeta {
  constructor(method, params) {
    if (typeof method !== "string" || method.length === 0 || method === "!") {
      throw new Error(
        `Please specify a valid validation method. \`${method}\` specified.`
      );
    }

    method = method.trim();

    if (method[0] === "!") {
      this.skippable = true;
      this.method = method.slice(1);
    } else {
      this.skippable = false;
      this.method = method + "";
    }

    if (!DataValidator.validators.hasOwnProperty(this.method)) {
      throw new Error("Unknown validation method requested: " + this.method);
    }

    const validatorDefinition = DataValidator.validators[this.method];

    this.args = {};
    this.params = [];

    if (Array.isArray(params)) {
      this.params = params.slice();

      if (Array.isArray(validatorDefinition.args)) {
        for (const [i, argName] of validatorDefinition.args.entries()) {
          let argValue = params[i];

          if (!argValue) {
            argValue = "";
          }

          this.args[argName] = argValue;
        }
      }
    }
  }
}

class DataValidator {
  static validators = {};
  rules = null;

  /**
   * Returns a ValidatorMeta instance with the validator method and params properties.
   * @param {string} validator A validator definition string, i.e. 'required', 'email' or 'sameAs:password'.
   * @returns {ValidatorMeta}
   * @throws Will throw an error if the specified validator doesn't exist.
   */
  static getValidatorMeta(validator) {
    const escapeResolver = new StringEscapeResolver(":");

    let parts = escapeResolver.escape(validator).split(":");
    const unescapedParts = [];

    for (const part of parts) {
      unescapedParts.push(escapeResolver.unescape(part));
    }

    const method = unescapedParts[0];

    return new ValidatorMeta(method, unescapedParts.slice(1));
  }

  /**
   * Process a validation message and replace all possible template vars.
   * @param {string} message The raw message, containing possible template vars ( {{min}}, {{max}} ).
   * @param {ValidatorMeta} validatorMeta A ValidatorMeta object.
   * @returns {string}
   */
  static processMessage(message, validatorMeta) {
    if (message.indexOf("{{") === -1) {
      return message;
    }

    for (const argKey of Object.keys(validatorMeta.args)) {
      const argValue = validatorMeta.args[argKey];

      message = message.split(`{{${argKey}}}`).join(argValue);
    }

    return message;
  }

  /**
   * Return a validation message.
   * @param {ValidatorMeta} validatorMeta A ValidatorMeta object.
   * @param {string[]} customMessages Any custom validation messages specified in the rule definition.
   * @param {number} validatorIndex The index of the validator being processed, used in conjunction with the customMessages array.
   * @returns {string}
   */
  static getMessage(validatorMeta, customMessages = [], validatorIndex = 0) {
    if (Array.isArray(customMessages) && customMessages.length > 0) {
      const customMessage = customMessages[validatorIndex];

      if (customMessage !== undefined) {
        return customMessage;
      }
    }

    return DataValidator.validators[validatorMeta.method].message + "";
  }

  /**
   * Runs a single validator with the specified value and return true if the
   * validation passed and false otherwise.
   * @param {ValidatorMeta} validatorMeta A ValidatorMeta object.
   * @param {*} value The value from the data object being validated.
   * @param {{}} data The data object being validated.
   * @param {string} fieldName The name of the field, i.e. 'email'.
   * @returns {boolean}
   */
  static runValidator(validatorMeta, value, data, fieldName) {
    return DataValidator.validators[validatorMeta.method].call(
      null,
      value,
      data,
      fieldName,
      ...validatorMeta.params
    );
  }

  constructor(fieldRules = {}) {
    if (Object.keys(fieldRules).length > 0) {
      this.setRules(fieldRules);
    }
  }

  hasRules() {
    return this.rules !== null && Object.keys(this.rules).length > 0;
  }

  fieldRuleExists(field, ruleMethod) {
    if (this.rules === null || !this.rules.hasOwnProperty(field)) {
      return false;
    }

    for (const validatorDefinition of this.rules[field].validators) {
      const validatorMeta = DataValidator.getValidatorMeta(validatorDefinition);

      if (ruleMethod === validatorMeta.method) {
        return true;
      }
    }

    return false;
  }

  setRules(fieldRules) {
    this.rules = {};
    let fieldName = null;

    for (fieldName in fieldRules) {
      const field = fieldRules[fieldName];

      if (!Array.isArray(field.validators) || field.validators.length === 0) {
        continue;
      }

      this.rules[fieldName] = {
        validators: field.validators.slice(),
        messages: field.messages ? field.messages.slice() : undefined,
        label: field.label ? field.label + "" : undefined,
      };
    }
  }

  validate(data) {
    let fieldName = null;
    const validationMessages = {};

    if (!this.hasRules()) {
      return validationMessages;
    }

    for (fieldName in this.rules) {
      const field = this.rules[fieldName];
      let i = 0;
      let l = field.validators.length;
      const fieldMessages = [];

      for (; i < l; i++) {
        const validatorDefinition = field.validators[i];
        const value = data[fieldName];
        const validatorMeta =
          DataValidator.getValidatorMeta(validatorDefinition);

        const fieldValid = DataValidator.runValidator(
          validatorMeta,
          value,
          data,
          fieldName
        );

        if (!fieldValid) {
          let message = DataValidator.getMessage(
            validatorMeta,
            field.messages,
            i
          );

          message = DataValidator.processMessage(message, validatorMeta);

          fieldMessages.push(message);

          if (!validatorMeta.skippable) {
            break;
          }
        }
      }

      if (fieldMessages.length > 0) {
        validationMessages[fieldName] = fieldMessages;
      }
    }

    return validationMessages;
  }
}

DataValidator.validators["email"] = email;
DataValidator.validators["lengthBetween"] = lengthBetween;
DataValidator.validators["matchRegex"] = matchRegex;
DataValidator.validators["max"] = max;
DataValidator.validators["maxLength"] = maxLength;
DataValidator.validators["min"] = min;
DataValidator.validators["minLength"] = minLength;
DataValidator.validators["required"] = required;
DataValidator.validators["sameAs"] = sameAs;

export default DataValidator;
