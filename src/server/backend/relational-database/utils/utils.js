import fs from "fs";
import path from "path";
import * as errorMessages from "../messages/errors";

/**
 * CONSTANTS
 */

export function getOperator(operatorName) {
  if (operatorName === "e") return "=";
  else if (operatorName === "elt") return "<=";
  else if (operatorName === "egt") return ">=";
  else if (operatorName === "gt") return ">";
  else if (operatorName === "lt") return "<";
}

/**
 * GENERATORS
 */

export function generateComparableFields(field) {
  return [field, field + ".e", field + ".elt", field + ".egt", field + ".gt", field + ".lt"];
}

/**
 * VALIDATION
 */

export function isObjectFieldsValid(object, acceptedFields, fieldNames, fieldConstraints) {
  let response = { isKeyNamesValid: false, isKeyValuesValid: false };

  // If object is empty or not defined
  if (Object.keys(object || {}).length === 0) {
    return { isKeyNamesValid: true, isKeyValuesValid: true };
  }

  // isKeyNamesValid validation
  response.isKeyNamesValid = Object.keys(object).every((fieldName) => {
    return acceptedFields.includes(fieldName);
  });
  if (response.isKeyNamesValid === false) return response;

  // isKeyValuesValid validation
  response.isKeyValuesValid = Object.keys(object).every((fieldName) => {
    let fieldValue = object[fieldName];
    let constraints = fieldConstraints[fieldNames.indexOf(fieldName.split(".")[0])];
    if (constraints.includes("NOT NULL") && !fieldValue) return false;
    if (constraints.includes("String") && typeof fieldValue !== "string") return false;
    if (constraints.includes("Number") && typeof Number(fieldValue) !== "number") return false;
    if (constraints.includes("Date") && !isDate(new Date(fieldValue))) return false;
    return true;
  });

  return response;
}

export function isDate(param) {
  if (param instanceof Date && !isNaN(param)) {
    return true;
  } else return false;
}

export function isFieldNumber(field) {
  return !isNaN(Number(field));
}

export function hasRequiredFields(requiredFields, object) {
  return requiredFields.every((field) => {
    return Object.keys(object).includes(field);
  });
}

export function hasDuplicateFields(object) {
  if (typeof object === "object") return new Set(Object.keys(object)).size === Object.keys(object).length;
  else return false;
}

export function hasFieldWithValue(object, fieldName) {
  return object[fieldName] !== null && object[fieldName] !== undefined && object[fieldName] !== "";
}

export function hasFieldsWithValue(object = {}, fieldNames = []) {
  if (Object.keys(object) === 0 || (!Array.isArray(fieldNames) && fieldNames.length === 0)) return false;
  return fieldNames.every((fieldName) => {
    return (
      object.hasOwnProperty(fieldName) &&
      object[fieldName] !== null &&
      object[fieldName] !== undefined &&
      object[fieldName] !== ""
    );
  });
}

/**
 * ERROR MESSAGES
 */

export function getErrorMessagesByCodes(codes) {
  let errors = [];
  Object.keys(errorMessages).forEach((errorName) => {
    let errorTemplate = errorMessages[errorName];
    if (codes.includes(errorTemplate.code)) errors.push(errorTemplate);
  });
  return errors;
}

/**
 * ACTIONS
 */

export function getActionsByCodes(codes) {
  let actions = [];
  Object.keys(actions).forEach((actionName) => {
    let actionTemplate = actions[actionName];
    if (codes.includes(actionTemplate.code)) actions.push(actionTemplate);
  });
  return actions;
}
