import * as database from "./database";
import * as holonsQueryGenerator from "./query-generators/holons";
import * as usersQueryGenerator from "./query-generators/users";
import * as errorMessages from './messages/errors';
import * as utils from './utils/utils';

/**
 * AUTH
 */

export async function getStatus() {
  let response = { errors: [], results: null };
  const { errors, databaseError, results } = await database.executeQuery("SELECT NOW()", []);

  // Invalid API parameters
  if (errors.length > 0) {
    response.errors = queryObject.errors;
    return response;
  }

  // Database returned error
  if (databaseError) {
    response.errors.push(errorMessages.UNEXPECTED_DATABASE_RESPONSE_ERROR);
    return response;
  }

  // Database returned results
  if (results.length > 0) {
    response.results = results;
    return response;
  }

  return response;
}

/**
 * USERS
 */

export async function getUsers(parameters) {
  const { isForAuth, user, filters } = parameters;
  let response = { errors: [], results: null };
  console.log("DB API ", parameters)
  let queryObject = usersQueryGenerator.getUsers({ isForAuth, user, filters });

  // Failure to generate query
  if(!queryObject.query) {
    response.errors.push(errorMessages.UNABLE_TO_GENERATE_QUERY);
    return response;
  }

  // Execute query
  const { errors, databaseError, results } = await database.executeQuery(queryObject.query, queryObject.values);

  // Error occured
  if (errors.length > 0) {
    response.errors = errors;
    return response;
  }

  // Database returned error
  if (databaseError) {
    response.errors.push(errorMessages.UNEXPECTED_DATABASE_RESPONSE_ERROR);
    return response;
  }

  // Successfull query
  response.results = results;
  return response;
}

export async function createUser(user) {}

export async function editUser(userId, editedFields) {
  const response = { errorCodes: [], databaseErrorMessage: null, results: null };

  let queryObject = usersQueryGenerator.editUser(userId, editedFields);

  // Invalid API parameters
  if (queryObject.errorCodes.length > 0) {
    response.errorCodes = queryObject.errorCodes;
    return response;
  }

  // Check admin privileges if needed
  if (queryObject.requireAdminPrivileges) {
    const { errorCodes, databaseErrorMessage, results } = await database.executeQuery(
      "SELECT id FROM users WHERE id = $1 AND role = $2",
      [userId, "admin"]
    );

    // Error occured or database returned error
    if (errorCodes.length > 0) {
      if (databaseErrorMessage) errorCodes[0].databaseErrorMessage = databaseErrorMessage.toString();
      response.errorCodes = errorCodes;
      return response;
    }

    // No required privileges
    if (results.length !== 1) {
      response.errorCodes.push(6);
      return response;
    }
  }

  // Execute query
  const { errorCodes, databaseErrorMessage, results } = await database.executeQuery(
    queryObject.query,
    queryObject.values
  );

  // Error occured or database returned error
  if (errorCodes.length > 0) {
    errorCodes[0].databaseErrorMessage = databaseErrorMessage.toString();
    response.errorCodes = errorCodes;
    return response;
  }

  // Successfull query
  response.results = results;
  return response;
}

export async function deleteUser(userId) {}

/**
 * HOLONS
 */

export async function getHolons(userId, filters) {
  let response = { errorCodes: [], databaseErrorMessage: null, results: null };

  const queryObject = holonsQueryGenerator.getHolons(userId, filters);

  // Invalid API parameters
  if (queryObject.errorCodes.length > 0) {
    response.errorCodes = queryObject.errorCodes;
    return response;
  }

  // Execute query
  const { errorCodes, databaseErrorMessage, results } = await database.executeQuery(
    queryObject.query,
    queryObject.values
  );

  // Error occured or database returned error
  if (errorCodes.length > 0) {
    if (databaseErrorMessage) errorCodes[0].databaseErrorMessage = databaseErrorMessage.toString();
    response.errorCodes = errorCodes;
    return response;
  }

  // Successfull query
  response.results = results;
  return response;
}

export async function createHolon(userId, holon) {
  let response = { errorCodes: [], databaseErrorMessage: null, results: null };
  let queryObject = holonsQueryGenerator.createHolon(userId, holon);

  if (queryObject.errorCodes.length > 0) {
    response.errorCodes = queryObject.errorCodes;
  } else {
    const { errorCodes, databaseErrorMessage, results } = await database.executeQuery(
      queryObject.query,
      queryObject.values
    );
    if (errorCodes.length > 0) {
      if (databaseErrorMessage) response.databaseErrorMessage = databaseErrorMessage.toString();
      response.errorCodes = errorCodes;
    } else {
      response.results = results;
    }
  }
  return response;
}

export async function editHolon(userId, editedFields) {}

export async function deleteHolon(userId, holonId) {}

/**
 * ALGORITHMS
 */

export async function getAlgorithms(filters) {}

export async function editAlgorithm(algorithmId, editedFields) {}

export async function deleteAlgorithm(algorithmId) {}

/**
 * TASKS
 */

export async function getTasks(userId, filters) {}

export async function editTask(userId, editedFields) {}

export async function deleteTask(userId, taskId) {}

/**
 * DASHBOARD SETTINGS
 */

export async function getDashboardSettings(userId) {}

export async function editDashboardSettings(userId, editedFields) {}

export async function deleteDashboardSettings(userId) {}

/**
 * ALLOCATIONS
 */

export async function getAllocations(userId, filters) {}

export async function editAllocation(userId, editedFields) {}

export async function deleteAllocation(userId, allocationId) {}
