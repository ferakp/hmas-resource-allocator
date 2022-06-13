import * as queryGeneratorUtil from "../utils/queryGenerator";
import * as utils from "../utils/utils";

/**
 * Query generator for retrieving users
 * @param {object} parameters has properties isForAuth, requester, filters
 * @returns {object} {query, values}
 */
export function getUsers(parameters) {
  const { isForAuth, requester, filters } = parameters;
  let response = { query: null, values: null };

  // Query for retrieving user by username or email for authentication or authorization
  if (isForAuth && filters.username && filters.email) {
    response.query = "SELECT * FROM users WHERE username=$1 OR email=$2";
    response.values = [filters.username, filters.email];
    return response;
  }

  // Query for retrieving user by username for authentication or authorization
  if (isForAuth && filters.username) {
    response.query = "SELECT * FROM users WHERE username=$1";
    response.values = [filters.username];
    return response;
  }

  // Query for retrieving user by id for authentication or authorization
  if (isForAuth && typeof filters.id === "number") {
    response.query = "SELECT * FROM users WHERE id=$1";
    response.values = [filters.id];
    return response;
  }

  // Query for retrieving user by email for authentication or authorization
  if (isForAuth && filters.email) {
    response.query = "SELECT * FROM users WHERE email=$1";
    response.values = [filters.email];
    return response;
  }

  // Query for requesting all users with and without filters
  if (requester) {
    const { query, values } = queryGeneratorUtil.generateSelectQuery(
      "users",
      ["id", "role", "username", "firstname", "lastname", "email", "created_on", "last_login", "updated_on"],
      filters,
      "AND"
    );

    let queryResponse;

    // Query constraint for user
    if (requester.role === "user") {
      queryResponse = addUserConstraint(query, values, requester);
    }

    // Query constraint for moderator
    if (requester.role === "moderator") {
      queryResponse = addModeratorConstraint(query, values, requester);
    }

    // Query constraint for admin
    if (requester.role === "admin") {
      queryResponse = addAdminConstraint(query, values, requester);
    }

    response.query = queryResponse?.query;
    response.values = queryResponse?.values;
    return response;
  }

  return response;
}

/**
 * Query generator for editing user
 * @param {object} parameters has properties requester and reqParams
 * @returns {object} {query, values}
 */
export function editUser(parameters) {
  const { requester, reqParams } = parameters;
  let response = { query: null, values: null };
  if (!utils.hasFieldsWithValue(reqParams, ["id"]) || Object.keys(reqParams).length === 1) return response;
  return queryGeneratorUtil.generateUpdateQuery("users", reqParams, ["id"]);
}

/**
 * Query generator for deleting user
 * @param {object} parameters has properties requester and filters
 * @returns {object} {query, values}
 */
export function deleteUser(parameters) {
  let response = { query: null, values: null };
  if (!utils.hasFieldsWithValue(parameters.filters, ["id"])) return response;
  response.query = "DELETE FROM users WHERE id=$1 RETURNING id";
  response.values = [parameters.filters?.id];
  return response;
}

/**
 * Query generator for creating user
 * @param {object} parameters has property reqParams
 * @returns {object} {query, values}
 */
export function createUser(parameters) {
  const { reqParams } = parameters;
  let response = { query: null, values: null };
  if (reqParams && reqParams.hasOwnProperty("id") && Object.keys(reqParams).length > 1) return response;

  return queryGeneratorUtil.generateInsertQuery("users", reqParams);
}

/**
 * UTILITY FUNCTIONS
 */

/**
 * ONLY FOR SELECT QUERY
 * Wraps a select query with another query which limits results
 * Accept only those results whose id is same as the requester's id
 * @param {string} query existing query
 * @param {array} values existing query values
 * @param {object} requester requester
 * @returns {object} {query, values}
 */
function addUserConstraint(query, values = [], requester) {
  let finalQuery = "SELECT * FROM (" + query + ") users WHERE id=$" + (values.length + 1);
  values.push(requester.id);

  return { query: finalQuery, values };
}

/**
 * ONLY FOR SELECT QUERY
 * Wraps a select query with another query which limits results
 * Accept only those results whose role is user or id same as the requester's id
 * @param {string} query existing query
 * @param {array} values existing query values
 * @param {object} requester requester
 * @returns {object} {query, values}
 */
function addModeratorConstraint(query, values = [], requester) {
  let finalQuery =
    "SELECT * FROM (" + query + ") users WHERE (id=$" + (values.length + 1) + " OR role=$" + (values.length + 2) + ")";
  values = values.concat([requester.id, "user"]);
  return { query: finalQuery, values };
}

/**
 * ONLY FOR SELECT QUERY
 * Wraps a select query with another query which limits results
 * Accept only those results whose role is (user or moderator) or whose id same as the requester's id
 * @param {string} query existing query
 * @param {array} values existing query values
 * @param {object} requester requester
 * @returns {object} {query, values}
 */
function addAdminConstraint(query, values = [], requester) {
  let finalQuery =
    "SELECT * FROM (" +
    query +
    ") users WHERE (id=$" +
    (values.length + 1) +
    " OR role=$" +
    (values.length + 2) +
    " OR role=$" +
    (values.length + 3) +
    ")";
  values = values.concat([requester.id, "user", "moderator"]);
  return { query: finalQuery, values };
}
