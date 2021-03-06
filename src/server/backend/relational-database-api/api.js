import * as database from './database';
import * as holonsQueryGenerator from './query-generators/holons';
import * as searchQueryGenerator from './query-generators/search';
import * as algorithmsQueryGenerator from './query-generators/algorithms';
import * as usersQueryGenerator from './query-generators/users';
import * as allocationsQueryGenerator from './query-generators/allocations';
import * as tasksQueryGenerator from './query-generators/tasks';
import * as settingsQueryGenerator from './query-generators/settings';
import * as errorMessages from './messages/errors';
import * as utils from './utils/utils';

/**
 * INTERNAL DATABASE API
 * Internal database API provides methods for querying a database
 *
 * All methods have common response format {query, values}
 */

/**
 * SEARCH
 */

export async function search(parameters) {
  const { requester, reqParams } = parameters;
  let response = { errors: [], results: [] };
  let queryObject = searchQueryGenerator.search({ requester, reqParams });

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

/**
 * AUTH
 */

export async function getStatus() {
  let response = { errors: [], results: null };
  const { errors, databaseError, results } = await database.executeQuery('SELECT NOW()', []);

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
  delete results[0]['password'];
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
  delete results[0]['password'];
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

export async function getHolons(parameters) {
  const { filters } = parameters;
  let response = { errors: [], results: null };

  let queryObject = holonsQueryGenerator.getHolons({ filters });

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

export async function createHolon(parameters) {
  const { reqParams } = parameters;
  let response = { errors: [], results: null };

  let queryObject = holonsQueryGenerator.createHolon({ reqParams });

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

export async function editHolon(parameters) {
  const { reqParams } = parameters;
  let response = { errors: [], results: null };

  let queryObject = holonsQueryGenerator.editHolon({ reqParams });

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

export async function deleteHolon(parameters) {
  const { reqParams } = parameters;
  let response = { errors: [], results: null };

  let queryObject = holonsQueryGenerator.deleteHolon({ reqParams });

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

/**
 * ALGORITHMS
 */

export async function getAlgorithms(parameters) {
  const { filters } = parameters;
  let response = { errors: [], results: null };

  let queryObject = algorithmsQueryGenerator.getAlgorithms({ filters });

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

export async function editAlgorithm(parameters) {
  const { reqParams } = parameters;
  let response = { errors: [], results: null };

  let queryObject = algorithmsQueryGenerator.editAlgorithm({ reqParams });

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

export async function createAlgorithm(parameters) {
  const { reqParams } = parameters;
  let response = { errors: [], results: null };

  let queryObject = algorithmsQueryGenerator.createAlgorithm({ reqParams });

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

export async function deleteAlgorithm(parameters) {
  const { reqParams } = parameters;
  let response = { errors: [], results: null };

  let queryObject = algorithmsQueryGenerator.deleteAlgorithm({ reqParams });

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

/**
 * TASKS
 */

export async function getTasks(parameters) {
  const { filters } = parameters;
  let response = { errors: [], results: null };

  let queryObject = tasksQueryGenerator.getTasks({ filters });

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

export async function editTask(parameters) {
  const { reqParams } = parameters;
  let response = { errors: [], results: null };

  let queryObject = tasksQueryGenerator.editTask({ reqParams });

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

export async function deleteTask(parameters) {
  const { reqParams } = parameters;
  let response = { errors: [], results: null };

  let queryObject = tasksQueryGenerator.deleteTask({ reqParams });

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

export async function createTask(parameters) {
  const { reqParams } = parameters;
  let response = { errors: [], results: null };

  let queryObject = tasksQueryGenerator.createTask({ reqParams });

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

/**
 * DASHBOARD SETTINGS
 */

export async function getSettings(parameters) {
  const { isForAuth, requester, filters } = parameters;
  let response = { errors: [], results: null };

  let queryObject = settingsQueryGenerator.getSettings({ isForAuth, requester, filters });

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

export async function editSettings(parameters) {
  const { reqParams } = parameters;
  let response = { errors: [], results: null };

  let queryObject = settingsQueryGenerator.editSettings({ reqParams });

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

export async function createSettings(parameters) {
  const { reqParams } = parameters;
  let response = { errors: [], results: null };

  let queryObject = settingsQueryGenerator.createSettings({ reqParams });

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

export async function deleteSettings(parameters) {
  const { reqParams } = parameters;
  let response = { errors: [], results: null };

  let queryObject = settingsQueryGenerator.deleteSettings({ reqParams });

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

/**
 * ALLOCATIONS
 */

export async function getAllocations(parameters) {
  const { filters } = parameters;
  let response = { errors: [], results: null };

  let queryObject = allocationsQueryGenerator.getAllocations({ filters });

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

export async function createAllocation(parameters) {
  const { reqParams } = parameters;
  let response = { errors: [], results: null };

  let queryObject = allocationsQueryGenerator.createAllocation({ reqParams });

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

export async function editAllocation(parameters) {
  const { reqParams } = parameters;
  let response = { errors: [], results: null };

  let queryObject = allocationsQueryGenerator.editAllocation({ reqParams });

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

export async function deleteAllocation(parameters) {
  const { reqParams } = parameters;
  let response = { errors: [], results: null };

  let queryObject = allocationsQueryGenerator.deleteAllocation({ reqParams });

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
