import * as database from "./database";
import * as holonsQueryGenerator from "./query-generators/holons";
import * as usersQueryGenerator from "./query-generators/users";
import * as errorMessages from "./messages/errors";
import * as utils from "./utils/utils";


/**
 * INTERNAL DATABASE API
 * Internal database API provides methods for querying a database
 *
 * All methods have common response format {query, values}
 */

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
  const { isForAuth, requester, filters } = parameters;
  let response = { errors: [], results: null };

  let queryObject = usersQueryGenerator.getUsers({ isForAuth, requester, filters });

  // Failure to generate query
  if (!queryObject.query) {
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

export async function createUser(parameters) {
  const { requester, reqParams } = parameters;
  let response = { errors: [], results: [] };
  let queryObject = usersQueryGenerator.createUser({ reqParams });

  // Failure to generate query
  if (!queryObject.query) {
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
  delete results[0]["password"];
  response.results = results;
  return response;
}

export async function editUser(parameters) {
  const { requester, reqParams } = parameters;
  let response = { errors: [], results: [] };
  let queryObject = usersQueryGenerator.editUser({ requester, reqParams });

  // Failure to generate query
  if (!queryObject.query) {
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
  delete results[0]["password"];
  response.results = results;
  return response;
}

export async function deleteUser(parameters) {
  const { requester, filters } = parameters;
  let response = { errors: [], results: [] };
  let queryObject = usersQueryGenerator.deleteUser({ requester, filters });

  // Failure to generate query
  if (!queryObject.query) {
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

export async function userHasLoggedIn(id) {
  let response = { errors: [], results: [] };

  if (id == undefined || id === null) {
    response.errors.push(errorMessages.USER_NOT_FOUND);
  } else {
    const queryObject = usersQueryGenerator.editUser({
      reqParams: { id: id, last_login: new Date(), updated_on: new Date() },
    });

    if (queryObject.query) {
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
      response.results = results;
    }
  }

  return response;
}

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
