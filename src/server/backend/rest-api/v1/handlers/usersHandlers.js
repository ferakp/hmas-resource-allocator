import * as rDatabaseApi from "../../../relational-database-api/api";
import * as usersResponseGenerator from "../response-generators/users";
import * as utils from "../utils/utils";
import * as errorMessages from "../messages/errors";
import * as actions from "../messages/actions";
import * as requestConstraints from "../request-constraints/users";

/**
 * GET /users and /users/:id
 */

export async function getUsers(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let query = JSON.parse(JSON.stringify(req.query));
  const requester = req.requester;
  utils.hasFieldWithValue(req.params, "id") ? (query.id = req.params.id) : "";

  // Formatting
  const formatResponse = utils.formatRequestQuery(
    query,
    requestConstraints.allFieldNames,
    requestConstraints.allFieldConstraints
  );
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else query = formatResponse.formattedQuery;

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Get users with given details
    const { errors, results } = await rDatabaseApi.getUsers({ requester, filters: query });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = usersResponseGenerator.getUsers(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * POST /users/:id
 */

export async function postUser(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let parameters = JSON.parse(JSON.stringify(req.body));
  const requester = req.requester;

  // Update updated_on and created_on parameter
  parameters["updated_on"] = new Date();
  parameters["created_on"] = new Date();

  // Hash password
  parameters["password"] = await utils.encryptPassword(parameters["password"]);
  if (!parameters["password"]) responseDetails.errors.push(errorMessages.UNEXPECTED_ERROR);

  // Formatting
  const formatResponse = utils.formatRequestQuery(
    parameters,
    requestConstraints.allFieldNames,
    requestConstraints.allFieldConstraints
  );
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else parameters = formatResponse.formattedQuery;

  // Check if user with given username or email exists
  let dbResponse = {};
  if (responseDetails.errors.length === 0) {
    dbResponse = await rDatabaseApi.getUsers({ isForAuth: true, filters: parameters });
    responseDetails.errors = responseDetails.errors.concat(dbResponse.errors || []);
  }

  // If username and email already exist
  if (responseDetails.errors.length === 0 && dbResponse.results?.length > 1)
    responseDetails.errors.push(errorMessages.USERNAME_AND_EMAIL_ALREADY_REGISTERED);

  // If username or email already exists
  if (responseDetails.errors.length === 0 && dbResponse.results?.length > 0) {
    // If email already exists
    if (dbResponse.results[0].email === parameters.email)
      responseDetails.errors.push(errorMessages.EMAIL_ALREADY_REGISTERED);
    // If usernamealready exists
    else if (dbResponse.results[0].username === parameters.username)
      responseDetails.errors.push(errorMessages.USERNAME_ALREADY_REGISTERED);
    // If database returns unexpected result
    else responseDetails.errors.push(errorMessages.UNEXPECTED_DATABASE_RESPONSE_ERROR);
  }

  // Create user
  if (responseDetails.errors.length === 0) {
    dbResponse = await rDatabaseApi.createUser({ reqParams: parameters });
    responseDetails.errors = responseDetails.errors.concat(dbResponse.errors || []);
    if (responseDetails.errors.length === 0) responseDetails.results = dbResponse.results;
  }

  // Generate response
  const response = usersResponseGenerator.patchUser(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * PATCH /users/:id
 */

export async function patchUser(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let parameters = JSON.parse(JSON.stringify(req.body));
  const requester = req.requester;
  utils.hasFieldWithValue(req.params, "id") ? (parameters.id = req.params.id) : "";

  // Update updated_on parameter
  parameters["updated_on"] = new Date();

  // Hash password if password change is requested
  if (parameters["password"]) {
    parameters["password"] = await utils.encryptPassword(parameters["password"]);
    if (!parameters["password"]) responseDetails.errors.push(errorMessages.UNEXPECTED_UPDATE_ERROR);
  }

  // Formatting
  const formatResponse = utils.formatRequestQuery(
    parameters,
    requestConstraints.allFieldNames,
    requestConstraints.allFieldConstraints
  );
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else parameters = formatResponse.formattedQuery;

  // Check email availability if email change is requested
  if (utils.hasFieldWithValue(parameters, "email")) {
    // Get user with given email
    const { errors, results } = await rDatabaseApi.getUsers({
      isForAuth: true,
      filters: { email: parameters["email"] },
    });

    if (errors.length > 0) responseDetails.errors.push(errorMessages.UNEXPECTED_UPDATE_ERROR);
    if (results.length > 0) responseDetails.errors.push(errorMessages.EMAIL_ALREADY_REGISTERED);
  }

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Get users with given details
    const { errors, results } = await rDatabaseApi.editUser({ requester, reqParams: parameters });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = usersResponseGenerator.patchUser(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * DELETE /users/:id
 */

export async function deleteUser(req, res) {
  const responseDetails = { req, res, actions: [], errors: [], results: [] };

  // Parameters
  let parameters = JSON.parse(JSON.stringify(req.query));
  const requester = req.requester;
  utils.hasFieldWithValue(req.params, "id") ? (parameters.id = req.params.id) : "";

  // Formatting
  const formatResponse = utils.formatRequestQuery(
    parameters,
    requestConstraints.allFieldNames,
    requestConstraints.allFieldConstraints
  );
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else parameters = formatResponse.formattedQuery;

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Delete user with given id
    const { errors, results } = await rDatabaseApi.deleteUser({ requester, filters: parameters });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Add action LOGOUT
  if (responseDetails.errors.length === 0) {
    responseDetails.actions.push(actions.LOGOUT);
  }

  // Generate response
  const response = usersResponseGenerator.deleteUser(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}
