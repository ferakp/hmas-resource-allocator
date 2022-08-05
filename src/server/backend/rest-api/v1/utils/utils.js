import fs from 'fs';
import path from 'path';
import * as errorMessages from '../messages/errors';
import * as action from '../messages/actions';
import bcrypt from 'bcrypt';

/**
 * CONSTANTS
 */

export function getOperator(operatorName) {
  if (operatorName === 'e') return '=';
  else if (operatorName === 'elt') return '<=';
  else if (operatorName === 'egt') return '>=';
  else if (operatorName === 'gt') return '>';
  else if (operatorName === 'lt') return '<';
}

/**
 * GENERATORS
 */

export function generateComparableFields(field) {
  return [field, field + '.e', field + '.elt', field + '.egt', field + '.gt', field + '.lt'];
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
    let constraints = fieldConstraints[fieldNames.indexOf(fieldName.split('.')[0])];
    if (constraints.includes('NOT NULL') && !fieldValue) return false;
    if (constraints.includes('String') && typeof fieldValue !== 'string') return false;
    if (constraints.includes('Number') && typeof Number(fieldValue) !== 'number') return false;
    if (constraints.includes('Date') && !isDate(new Date(fieldValue))) return false;
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
    if (allFieldNames.indexOf(fieldName) === -1) return false;
    let constraints = allFieldConstraints[allFieldNames.indexOf(fieldName)];
    if (constraints.includes('not null') && !isNotNull(fieldValue)) return false;
    if (constraints.includes('array') && fieldValue !== null && !Array.isArray(fieldValue)) return false;
    if (constraints.includes('string') && fieldValue !== null && typeof fieldValue !== 'string') return false;
    if (constraints.includes('number') && fieldValue !== null && !isFieldNumber(fieldValue)) return false;
    if (constraints.includes('date') && fieldValue !== null && !isDate(new Date(fieldValue))) return false;
    if (constraints.includes('boolean') && fieldValue !== null && !isBoolean(convertToBoolean(fieldValue))) return false;
    return true;
  });
}

export function isNotNull(param) {
  if (param === null || param === undefined || param === '') return false;
  else return true;
}

export function isBoolean(param) {
  if (typeof param === 'boolean') return true;
  else return false;
}

export function isDate(param) {
  if (param instanceof Date && !isNaN(param)) {
    return true;
  } else return false;
}

export function isArrayElementsString(array) {
  if (!Array.isArray(array)) return false;
  else {
    return array.every((e) => {
      if (!e || typeof e !== 'string') return false;
      else return true;
    });
  }
}

export function isArrayElementsNumber(array) {
  if (!Array.isArray(array)) return false;
  else {
    return array.every((e) => {
      if (!isFieldNumber(e)) return false;
      else return true;
    });
  }
}

export function isFieldNumber(field) {
  return isNumber(field);
}

export function isNumber(field) {
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
  return object[fieldName] !== null && object[fieldName] !== undefined && object[fieldName] !== '';
}

export function hasFieldsWithValue(object, fieldNames) {
  return Object.keys(object).every((key) => {
    return object[key] !== null && object[key] !== undefined && object[key] !== '' && fieldNames.includes(key);
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

  if (userRole === 'user') hasPrivilege = false;
  if (userRole === 'moderator' && requestedUserRole !== 'user') hasPrivilege = false;
  if (userRole === 'admin' && !['user', 'moderator'].includes(requestedUserRole)) hasPrivilege = false;

  return hasPrivilege;
}

/**
 * CONVERTERS
 */

export function removeDuplicateElements(array) {
  if (!Array.isArray(array)) return [];
  const tempArray = [];
  array.forEach((e) => {
    if (!tempArray.includes(e)) tempArray.push(e);
  });
  return tempArray;
}

export function removeOperatorFromObjectFieldNames(object) {
  let tempQuery = {};

  Object.keys(object).forEach((key) => {
    tempQuery[key.split('.')[0]] = object[key];
  });

  return tempQuery;
}

export function formatRequestQuery(query = {}, allFieldNames = [], allFieldConstraints = []) {
  let response = { errors: [], formattedQuery: null };
  if (Object.keys(query).length === 0 || allFieldNames.length === 0 || allFieldConstraints.length === 0) return query;
  try {
    let tempQuery = removeOperatorFromObjectFieldNames(query);
    Object.keys(tempQuery).forEach((key, i) => {
      let constraints = allFieldConstraints[allFieldNames.indexOf(key)];
      if (constraints.includes('string') && query[Object.keys(query)[i]] !== null) query[Object.keys(query)[i]] = tempQuery[key].toString();
      else if (constraints.includes('number') && query[Object.keys(query)[i]] !== null)  query[Object.keys(query)[i]] = Number(tempQuery[key]);
      else if (constraints.includes('date') && query[Object.keys(query)[i]] !== null) query[Object.keys(query)[i]] = new Date(tempQuery[key]);
      else if (constraints.includes('boolean') && query[Object.keys(query)[i]] !== null) query[Object.keys(query)[i]] = convertToBoolean(tempQuery[key]);
      else if (constraints.includes('array') && query[Object.keys(query)[i]] !== null && !Array.isArray(query[Object.keys(query)[i]])) throw new Error();
    });
    response.formattedQuery = query;
  } catch (err) {
    response.errors.push(errorMessages.UNABLE_TO_FORMAT_QUERY);
  }
  return response;
}

export function convertToBoolean(result) {
  if (typeof result === 'string' && result === 'true') return true;
  else if (typeof result === 'string' && result === 'false') return true;
  else if (typeof result === 'boolean') return result;
  else return null;
}

export function formatAllocationForCompleteRequest(allocation) {
  let responseDetails = { errors: [], allocation: null };
  try {
    allocation.id = Number(allocation.id);
    allocation.request_by = Number(allocation.request_by);
    allocation.request = JSON.parse(allocation.request);
    allocation.result = allocation.result ? JSON.parse(allocation.result) : null;
    allocation.start_time = allocation.start_time ? new Date(allocation.start_time) : null;
    allocation.end_time = allocation.end_time ? new Date(allocation.end_time) : null;
    allocation.created_on = new Date(allocation.created_on);
    allocation.completed_on = allocation.completed_on ? new Date(allocation.completed_on) : null;
    allocation.updated_on = allocation.updated_on ? new Date(allocation.updated_on) : null;
    allocation.reallocate = convertToBoolean(allocation.reallocate) ? true : false;
    responseDetails.allocation = allocation;
  } catch (err) {
    responseDetails.errors.push(errorMessages.BROKEN_ALLOCATION);
  }

  return responseDetails;
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

/**
 * REQUEST VALIDATORS
 */

export function getRequestValidationCheck(parameters) {
  const { query, acceptedFieldNames, allFieldNames, allFieldConstraints } = parameters;
  const errors = [];

  if (acceptedFieldNames.length === 0 || allFieldNames.length === 0 || allFieldConstraints.length === 0) {
    errors = errors.push(errorMessages.UNEXPECTED_ERROR);
    return errors;
  } else if (Object.keys(query).length === 0) return errors;
  // Validator responses
  let hasDuplicateQueryKeys = false;
  let hasCorrectQueryKeys = false;
  let hasCorrectQueryValues = false;

  // Validate for duplication check
  hasDuplicateQueryKeys = hasDuplicateElements(Object.keys(query).map((key) => key.split('.')[0]));

  // If query has no duplicate keys
  if (!hasDuplicateQueryKeys) {
    // Validate query keys
    hasCorrectQueryKeys = isObjectFieldNamesValid(query, acceptedFieldNames);
    // Validate query values
    hasCorrectQueryValues = isObjectFieldValuesValid(removeOperatorFromObjectFieldNames(query), allFieldNames, allFieldConstraints);
  }

  // Duplicate keys
  if (errors.length === 0 && hasDuplicateQueryKeys) {
    errors.push(errorMessages.DUPLICATE_QUERY_KEYS);
  }
  // Invalid query keys
  if (errors.length === 0 && !hasCorrectQueryKeys) {
    errors.push(errorMessages.INVALID_QUERY_STRING_KEY);
  }
  // Invalid query values
  if (errors.length === 0 && !hasCorrectQueryValues) {
    errors.push(errorMessages.INVALID_QUERY_STRING_VALUE);
  }

  return errors;
}

export function patchRequestValidationCheck(parameters) {
  const errors = [];
  const { reqParams, acceptedFieldNames, allFieldNames, allFieldConstraints, id } = parameters;

  // Validator responses
  let hasRequiredParameters = true;
  let hasDuplicateParameters = false;
  let hasCorrectParameterNames = false;
  let hasCorrectParameterValues = false;

  // Check for required parameters
  // (1) Request must have parameters
  if (Object.keys(reqParams).length === 0) hasRequiredParameters = false;

  if (hasRequiredParameters) {
    // Check for duplicate parameters
    hasDuplicateParameters = hasDuplicateElements(Object.keys(reqParams));
    // If query has no duplicate keys
    if (!hasDuplicateParameters) {
      // Validate parameter names
      hasCorrectParameterNames = isObjectFieldNamesValid(reqParams, acceptedFieldNames);
      // Validate parameter values
      if (hasCorrectParameterNames) {
        hasCorrectParameterValues = isObjectFieldValuesValid(reqParams, allFieldNames, allFieldConstraints);
      }
    }
  }

  // Add error for missing parameters
  if (!hasRequiredParameters) errors.push(errorMessages.MISSING_OR_INVALID_PARAMETERS);
  // Add error for duplicate parameters
  if (errors.length === 0 && hasDuplicateParameters) {
    errors.push(errorMessages.DUPLICATE_PARAMETERS);
  }
  // Add error for invalid parameter names
  if (errors.length === 0 && !hasCorrectParameterNames) {
    errors.push(errorMessages.INVALID_PARAMETER_NAMES);
  }
  // Add error for invalid parameter values
  if (errors.length === 0 && !hasCorrectParameterValues) {
    errors.push(errorMessages.INVALID_PARAMETER_VALUES);
  }
  // Add error for invalid id
  if (!isObjectFieldValuesValid({ id }, allFieldNames, allFieldConstraints)) {
    errors.push(errorMessages.USER_NOT_FOUND);
  }

  return errors;
}

export function postRequestValidationCheck(parameters) {
  const errors = [];
  const { reqParams, acceptedFieldNames, allFieldNames, allFieldConstraints, requiredFieldNames } = parameters;

  // Validator responses
  let hasRequiredParameters = true;
  let hasDuplicateParameters = false;
  let hasCorrectParameterNames = false;
  let hasCorrectParameterValues = false;

  // Check for required parameters
  hasRequiredParameters = requiredFieldNames.every((name) => Object.keys(reqParams).includes(name));

  if (hasRequiredParameters) {
    // Check for duplicate parameters
    hasDuplicateParameters = hasDuplicateElements(Object.keys(reqParams));
    // If query has no duplicate keys
    if (!hasDuplicateParameters) {
      // Validate parameter names
      hasCorrectParameterNames = isObjectFieldNamesValid(reqParams, acceptedFieldNames);
      // Validate parameter values
      hasCorrectParameterValues = isObjectFieldValuesValid(reqParams, allFieldNames, allFieldConstraints);
    }
  }

  // Add error for missing parameters
  if (!hasRequiredParameters) errors.push(errorMessages.MISSING_OR_INVALID_PARAMETERS);
  // Add error for duplicate parameters
  if (errors.length === 0 && hasDuplicateParameters) {
    errors.push(errorMessages.DUPLICATE_PARAMETERS);
  }
  // Add error for invalid parameter names
  if (errors.length === 0 && !hasCorrectParameterNames) {
    errors.push(errorMessages.INVALID_PARAMETER_NAMES);
  }
  // Add error for invalid parameter values
  if (errors.length === 0 && !hasCorrectParameterValues) {
    errors.push(errorMessages.INVALID_PARAMETER_VALUES);
  }

  return errors;
}

export function deleteRequestValidationCheck(parameters) {
  const errors = [];
  const { id, allFieldNames, allFieldConstraints } = parameters;

  // Add error for invalid id
  if (!isObjectFieldValuesValid({ id }, allFieldNames, allFieldConstraints)) {
    errors.push(errorMessages.INVALID_PARAMETER_VALUES);
  }

  return errors;
}

export function hasPermissionToEdit(parameters) {
  const errors = [];
  const { requester, resourceOwner } = parameters;

  if ((!resourceOwner || Object.keys(resourceOwner).length === 0) && requester.role !== 'admin') {
    errors.push(errorMessages.INSUFFICIENT_PRIVILEGES);
    return errors;
  } else if ((!resourceOwner || Object.keys(resourceOwner).length === 0) && requester.role === 'admin') return errors;
  if (Number(requester.id) === Number(resourceOwner.id)) return errors;
  if (hasFieldWithValue(requester, 'role') && hasFieldWithValue(resourceOwner, 'role')) {
    if (requester.role === 'admin' && resourceOwner.role === 'admin') errors.push(errorMessages.INSUFFICIENT_PRIVILEGES);
    else if (requester.role === 'moderator' && ['moderator', 'admin'].includes(resourceOwner.role)) errors.push(errorMessages.INSUFFICIENT_PRIVILEGES);
    else if (requester.role === 'user') errors.push(errorMessages.INSUFFICIENT_PRIVILEGES);
    else if (!['user', 'admin', 'moderator'].includes(requester.role)) errors.push(errorMessages.INSUFFICIENT_PRIVILEGES);
    return errors;
  } else {
    errors.push(errorMessages.INSUFFICIENT_PRIVILEGES);
    return errors;
  }
}

/**
 * HOLONS DATA FIELD UTILITIES
 */

export function formatAndFixHolonDataFields(holon) {
  const temp = { currentValue: 0, latestUpdate: new Date(), records: [] };

  if (!isHolonDataFieldCorrect(holon, 'cost_data')) holon['cost_data'] = JSON.parse(JSON.stringify(temp));
  else holon['cost_data'] = JSON.parse(holon['cost_data']);

  if (!isHolonDataFieldCorrect(holon, 'availability_data')) holon['availability_data'] = JSON.parse(JSON.stringify(temp));
  else holon['availability_data'] = JSON.parse(holon['availability_data']);

  if (!isHolonDataFieldCorrect(holon, 'stress_data')) holon['stress_data'] = JSON.parse(JSON.stringify(temp));
  else holon['stress_data'] = JSON.parse(holon['stress_data']);

  if (!isHolonDataFieldCorrect(holon, 'load_data')) holon['load_data'] = JSON.parse(JSON.stringify(temp));
  else holon['load_data'] = JSON.parse(holon['load_data']);

  return holon;
}

function isHolonDataFieldCorrect(holonTemp, fieldName) {
  try {
    const holon = JSON.parse(JSON.stringify(holonTemp));
    if (!holon[fieldName]) return false;
    holon[fieldName] = JSON.parse(holon[fieldName]);
    if (!holon[fieldName] || !isFieldNumber(holon[fieldName].currentValue) || !isDate(new Date(holon[fieldName].latestUpdate)) || !Array.isArray(holon[fieldName].records))
      return false;
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * SEARCH
 */

// Return empty array on error
export function getDeletedIds(requestedIds, receivedIds) {
  const deletedIds = [];

  if (!Array.isArray(requestedIds) || !Array.isArray(receivedIds)) return [];
  else {
    requestedIds.forEach((e) => {
      if (!receivedIds.includes(e)) deletedIds.push(e);
    });
  }

  return deletedIds;
}

// Return empty array on error
export function getUpdatedResources(requestedIds, receivedResources, latestUpdateTime) {
  const updatedResources = [];

  if (!Array.isArray(requestedIds) || !Array.isArray(receivedResources)) return [];
  else {
    receivedResources.forEach((e) => {
      if (isDate(new Date(latestUpdateTime)) && new Date(latestUpdateTime) < new Date(e.updated_on)) {
        updatedResources.push(e);
      } else if (!isDate(latestUpdateTime)) {
        updatedResources.push(e);
      }
    });
  }

  return updatedResources;
}
