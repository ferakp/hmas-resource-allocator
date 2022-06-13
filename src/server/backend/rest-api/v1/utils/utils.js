import fs from "fs";
import path from "path";
import * as errorMessages from "../messages/errors";
import * as action from "../messages/actions";
import bcrypt from 'bcrypt';

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

/**
 *
 * @param {object} object field to be checked
 * @param {array} acceptedFieldNames accepted field names
 * @param {*} allFieldNames
 * @param {*} fieldConstraints
 * @returns
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

export function isObjectFieldNamesValid(object = {}, acceptedFieldNames = []) {
  // If object is empty
  if (Object.keys(object || {}).length === 0) {
    return true;
  }

  return Object.keys(object).every((fieldName) => {
    return acceptedFieldNames.includes(fieldName);
  });
}

export function isObjectFieldValuesValid(object = {}, allFieldNames = [], allFieldConstraints = []) {
  if (Object.keys(object).length === 0 || allFieldNames.length === 0 || allFieldConstraints.length === 0) return true;
  return Object.keys(object).every((fieldName) => {
    let fieldValue = object[fieldName];
    if(allFieldNames.indexOf(fieldName) === -1) return false;
    let constraints = allFieldConstraints[allFieldNames.indexOf(fieldName)];
    if (constraints.includes("not null") && !fieldValue) return false;
    if (constraints.includes("string") && typeof fieldValue !== "string") return false;
    if (constraints.includes("number") && typeof Number(fieldValue) !== "number") return false;
    if (constraints.includes("date") && !isDate(new Date(fieldValue))) return false;
    return true;
  });
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

export function hasDuplicateElements(arr) {
  if (Array.isArray(arr)) return !(new Set(arr).size === arr.length);
  else return true;
}

export function hasFieldWithValue(object, fieldName) {
  return object[fieldName] !== null && object[fieldName] !== undefined && object[fieldName] !== "";
}

export function hasFieldsWithValue(object, fieldNames) {
  return Object.keys(object).every(key => {
    return object[key] !== null && object[key] !== undefined && object[key] !== "" && fieldNames.includes(key);
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

/**
 * PRIVILEGE
 */

export function userHasPrivileges(requester, requestedUser) {
  const requestedUserRole = requestedUser.role;
  const userRole = requester.role;
  let hasPrivilege = true;

  if (Number(requester.id) === Number(requestedUser.id)) return hasPrivilege;

  if (userRole === "user") hasPrivilege = false;
  if (userRole === "moderator" && requestedUserRole !== "user") hasPrivilege = false;
  if (userRole === "admin" && !["user", "moderator"].includes(requestedUserRole)) hasPrivilege = false;

  return hasPrivilege;
}

/**
 * CONVERTERS
 */

export function removeOperatorFromObjectFieldNames(object) {
  let tempQuery = {};

  Object.keys(object).forEach((key) => {
      tempQuery[key.split(".")[0]] = object[key];
  });

  return tempQuery;
}

export function formatRequestQuery(query = {}, allFieldNames = [], allFieldConstraints = []) {
  let response = { errors: [], formattedQuery: null};
  if (Object.keys(query).length === 0 || allFieldNames.length === 0 || allFieldConstraints.length === 0) return query;
  try {
    let tempQuery = removeOperatorFromObjectFieldNames(query);
    Object.keys(tempQuery).forEach((key, i) => {
      let constraints = allFieldConstraints[allFieldNames.indexOf(key)];
      if (constraints.includes("string")) query[Object.keys(query)[i]] = tempQuery[key].toString();
      else if (constraints.includes("number")) query[Object.keys(query)[i]] = Number(tempQuery[key]);
      else if (constraints.includes("date")) query[Object.keys(query)[i]] = new Date(tempQuery[key]);
    });
    response.formattedQuery = query;
  } catch (err) {
    response.errors.push(errorMessages.UNABLE_TO_FORMAT_QUERY);
  }
  return response;
}


/**
 * PASSWORD
 */

 export async function encryptPassword(plainPassword) {
  return new Promise(function (resolve, reject) {
    bcrypt.hash(plainPassword, 10, function (err, hash) {
      if (err) {
        resolve(null);
      } else {
        resolve(hash);
      }
    });
  });
}


export async function isPasswordCorrect(plainPassword, hash) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(plainPassword, hash, function (err, res) {
      if (err) {
        resolve(false);
      } else {
        resolve(res);
      }
    });
  });
}