import * as utils from "../../utils/utils";
import * as errorMessages from "../../messages/errors";
import * as responseGenerators from "../../response-generators/users";
import * as requestConstraints from "../../request-constraints/users";

const allFieldNames = requestConstraints.allFieldNames;
const allFieldConstraints = requestConstraints.allFieldConstraints;

export function getUsers(req, res, next) {
  const errors = [];
  const query = JSON.parse(JSON.stringify(req.query));
  // If path is users/:id
  if (utils.hasFieldWithValue(req.params, "id")) query.id = req.params.id;
  const acceptedFieldNames = requestConstraints.getUsers.acceptedFieldNames;

  // Validator responses
  let hasDuplicateQueryKeys = false;
  let hasCorrectQueryKeys = false;
  let hasCorrectQueryValues = false;

  // Validate for duplication check
  hasDuplicateQueryKeys = utils.hasDuplicateElements(Object.keys(query).map((key) => key.split(".")[0]));

  // If query has no duplicate keys
  if (!hasDuplicateQueryKeys) {
    // Validate query keys
    hasCorrectQueryKeys = utils.isObjectFieldNamesValid(query, acceptedFieldNames);
    // Validate query values
    hasCorrectQueryValues = utils.isObjectFieldValuesValid(
      utils.removeOperatorFromObjectFieldNames(query),
      allFieldNames,
      allFieldConstraints
    );
  }

  // Duplicate keys
  if (hasDuplicateQueryKeys) {
    errors.push(errorMessages.DUPLICATE_QUERY_KEYS);
  }

  // If no duplicate keys were found
  if (!hasDuplicateQueryKeys) {
    // Invalid query keys
    if (!hasCorrectQueryKeys) {
      errors.push(errorMessages.INVALID_QUERY_STRING_KEY);
    }
    // Invalid query values
    if (!hasCorrectQueryValues) {
      errors.push(errorMessages.INVALID_QUERY_STRING_VALUE);
    }
  }

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.getUsers({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function deleteUser(req, res, next) {
  const errors = [];
  const query = JSON.parse(JSON.stringify(req.query));
  // If path is users/:id
  if (utils.hasFieldWithValue(req.params, "id")) query.id = req.params.id;
  const acceptedFieldNames = requestConstraints.deleteUser.acceptedFieldNames;

  // Validator responses
  let hasCorrectQueryValues = false;

  // Validate query values
  hasCorrectQueryValues = utils.isObjectFieldValuesValid(query, allFieldNames, allFieldConstraints);

  if (!hasCorrectQueryValues) {
    res.sendStatus(204);
    return;
  }

  // Pass
  next();
}

export function patchUser(req, res, next) {
  const errors = [];
  const parameters = JSON.parse(JSON.stringify(req.body));
  const acceptedFieldNames = requestConstraints.patchUser.acceptedFieldNames;

  // Validator responses
  let hasRequiredParameters = true;
  let hasDuplicateParameters = false;
  let hasCorrectParameterNames = false;
  let hasCorrectParameterValues = false;

  // Check for required parameters
  // (1) Request must have parameters
  // (2) Request must not have illegal id or username parameters
  if (Object.keys(parameters).length === 0) hasRequiredParameters = false;

  // Override unaccepted role values
  if (parameters["role"] && !requestConstraints.patchUser.acceptedRoles.includes(parameters["role"])) {
    parameters["role"] = null;
  }

  if (hasRequiredParameters) {
    // Check for duplicate parameters
    hasDuplicateParameters = utils.hasDuplicateElements(Object.keys(parameters).map((key) => key.split(".")[0]));
    // If query has no duplicate keys
    if (!hasDuplicateParameters) {
      // Validate parameter names
      hasCorrectParameterNames = utils.isObjectFieldNamesValid(parameters, acceptedFieldNames);
      // Validate parameter values
      if (hasCorrectParameterNames) {
        hasCorrectParameterValues = utils.isObjectFieldValuesValid(
          utils.removeOperatorFromObjectFieldNames(parameters),
          allFieldNames,
          allFieldConstraints
        );
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
  if (!utils.isObjectFieldValuesValid({ id: req.params.id }, allFieldNames, allFieldConstraints)) {
    errors.push(errorMessages.USER_NOT_FOUND);
  }

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.patchUser({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function postUser(req, res, next) {
  const errors = [];
  const parameters = JSON.parse(JSON.stringify(req.body));
  const acceptedFieldNames = requestConstraints.postUser.acceptedFieldNames;

  // Validator responses
  let hasRequiredParameters = true;
  let hasDuplicateParameters = false;
  let hasCorrectParameterNames = false;
  let hasCorrectParameterValues = false;

  // Check for required parameters
  // (1) Request must have parameters
  // (2) Request must not have illegal id or username parameters
  if (Object.keys(parameters).length !== 6) hasRequiredParameters = false;

  // Override unaccepted role values
  if (parameters["role"] && !requestConstraints.patchUser.acceptedRoles.includes(parameters["role"])) {
    parameters["role"] = null;
  }

  if (hasRequiredParameters) {
    // Check for duplicate parameters
    hasDuplicateParameters = utils.hasDuplicateElements(Object.keys(parameters));
    // If query has no duplicate keys
    if (!hasDuplicateParameters) {
      // Validate parameter names
      hasCorrectParameterNames = utils.isObjectFieldNamesValid(parameters, acceptedFieldNames);
      // Validate parameter values
      hasCorrectParameterValues = utils.isObjectFieldValuesValid(parameters, allFieldNames, allFieldConstraints);
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

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.postUser({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}
