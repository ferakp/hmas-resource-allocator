import * as errorMessages from "../../rest-api/v1/messages/errors";
import * as utils from "../utils/utils";
import * as validator from "../../rest-api/v1/middlewares/request-validators/users";
import * as queryGenerator from "../utils/queryGenerator";

/**
 * Query generator for retrieving users
 * @param {object} parameters has properties isForAuth, requester, filters
 * @returns {object} {query, values}
 */
export function getUsers(parameters) {
  const { isForAuth, requester, filters } = parameters;
  let response = { query: null, values: null };

  // Query for retrieving user for authentication
  if (isForAuth && filters.username) {
    response.query = "SELECT * FROM users WHERE username=$1";
    response.values = [filters.username];
    return response;
  }

  // Query for requesting all users with and without filters
  if (requester) {
    const { query, values } = queryGenerator.generateSelectQuery(
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

    response.query = queryResponse.query;
    response.values = queryResponse.values;
    return response;
  }

  return response;
}

export function editUser(userId, fields) {
  let response = { errorCodes: [], query: null, values: null, requireAdminPrivileges: false };

  const validatorResponse = validator.validateEditUser(userId, fields);

  // Response for the errors
  if (validatorResponse.errorCodes.length > 0) {
    response.errorCodes = validatorResponse.errorCodes;
    return response;
  }

  // Response for the userId and the filters
  fields["updated_on"] = new Date();
  if (Number(fields.id) !== Number(userId)) response.requireAdminPrivileges = true;
  const { query, values } = utils.generateUpdateQuery("users", fields, ["id"]);
  response.query = query;
  response.values = values;

  return response;
}

/**
 * UTILITY FUNCTIONS
 */

function addUserConstraint(query, values = [], requester) {
  let finalQuery = "SELECT * FROM (" + query + ") users WHERE id=$" + (values.length + 1);
  values.push(requester.id);

  return { query: finalQuery, values };
}

function addModeratorConstraint(query, values = [], requester) {
  let finalQuery =
    "SELECT * FROM (" + query + ") users WHERE (id=$" + (values.length + 1) + " OR role=$" + (values.length + 2) + ")";
  values = values.concat([requester.id, "user"]);
  return { query: finalQuery, values };
}

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
  console.log(finalQuery);
  return { query: finalQuery, values };
}
