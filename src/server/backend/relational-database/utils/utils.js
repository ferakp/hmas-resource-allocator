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

export function generateWhereClause(fields, joinWord) {
  let whereClauseElements = [];
  let tempValues = [];
  Object.keys(fields).map((filter, i) => {
    let clause = filter.split(".")[0];
    filter.split(".").length === 2 ? (clause += getOperator(filter.split(".")[1])) : (clause += "=");
    whereClauseElements.push(clause + "$" + (i + 1));
    tempValues.push(fields[filter]);
  });
  return {
    clause: whereClauseElements.join(" " + joinWord + " "),
    values: tempValues,
  };
}

export function generateInsertQuery(tableName, fields) {
  let queryBase = "INSERT INTO holons(" + Object.keys(fields).join(",") + ") VALUES ";
  let values = "(" + Object.values(fields).map((e, i) => "$" + (i + 1)) + ")";
  return { query: queryBase + values, values: Object.values(fields) };
}

export function generateUpdateQuery(tableName, object, conditionFieldNames) {
  let queryBase = "UPDATE " + tableName;

  // Separate condition fields from updatable fields
  let conditionObject = {};
  conditionFieldNames.forEach((elementName) => {
    conditionObject[elementName] = object[elementName];
    delete object[elementName];
  });

  // Prepare set clause's elements
  let setClauseElements = [];
  Object.keys(object).map((fieldName, index) => {
    setClauseElements.push(fieldName + " = " + "$" + (index + 1));
  });

  // Prepare where clause's elements
  let whereClauseElements = [];
  Object.keys(conditionObject).map((fieldName, index) => {
    whereClauseElements.push(fieldName + " = " + "$" + (setClauseElements.length + index + 1));
  });

  let query = queryBase + " SET " + setClauseElements.join(",") + " WHERE " + whereClauseElements.join(",");
  let values = Object.values(object).append(Object.values(conditionObject));

  return {
    query: query,
    values: values,
  };
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
  if(response.isKeyNamesValid === false) return response;

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
  console.log(requiredFields, object);
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
