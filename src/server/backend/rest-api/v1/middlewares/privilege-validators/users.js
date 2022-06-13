import * as utils from "../../utils/utils";
import * as errorMessages from "../../messages/errors";
import * as responseGenerators from "../../response-generators/users";
import * as rDatabaseApi from "../../../../relational-database/api";

export async function getUsers(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;
  const query = { id: req.params.id };

  // If requester is requesting own user
  if (Number(req.params.id) === Number(requester.id)) {
    next();
    return;
  }

  const { errors, results } = await rDatabaseApi.getUsers({ isForAuth: true, filters: query });
  validationErrors = errors;

  // Path /users/:id doesn't exist
  if (errors.length === 0 && results.length === 0) {
    validationErrors.push(errorMessages.USER_NOT_FOUND);
  }

  // If there are multiple resources
  if (errors.length === 0 && results.length > 1) {
    validationErrors.push(errorMessages.UNEXPECTED_DATABASE_RESPONSE_ERROR);
  }

  // If user has no privileges
  if (errors.length === 0 && !utils.userHasPrivileges(requester, results[0]))
    validationErrors.push(errorMessages.UNAUTHORIZED_API_CALL);

  // User has no privileges or errors occured
  if (validationErrors.length > 0) {
    const response = responseGenerators.getUsers({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  next();
}

export async function deleteUser(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;
  const query = { id: Number(req.params.id) };

  // If requester is requesting own user
  if (Number(req.params.id) === Number(requester.id)) {
    next();
    return;
  }

  const { errors, results } = await rDatabaseApi.getUsers({ isForAuth: true, filters: query });
  validationErrors = errors;

  // User doesn't exist
  if (errors.length === 0 && results.length === 0) {
    res.sendStatus(204);
    return;
  }

  // If there are multiple resources for id
  if (errors.length === 0 && results.length > 1) {
    validationErrors.push(errorMessages.UNEXPECTED_DATABASE_RESPONSE_ERROR);
  }

  // If user has no privileges
  if (errors.length === 0 && !utils.userHasPrivileges(requester, results[0]))
    validationErrors.push(errorMessages.UNAUTHORIZED_API_CALL);

  // User has no privileges or errors occured
  if (validationErrors.length > 0) {
    const response = responseGenerators.deleteUser({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  next();
}

export async function patchUser(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;
  const query = { id: Number(req.params.id) };

  // Check for role changing constraint
  if (utils.hasFieldWithValue(req.body, "role")) {
    if (requester.role === "admin" && req.body.role === "admin")
      validationErrors.push(errorMessages.INSUFFICIENT_PRIVILEGES);
    else if (requester.role === "moderator" && ["moderator", "admin"].includes(req.body.role))
      validationErrors.push(errorMessages.INSUFFICIENT_PRIVILEGES);
    else if (requester.role === "user") validationErrors.push(errorMessages.INSUFFICIENT_PRIVILEGES);
  }

  // If requester is editing own user profile
  if (validationErrors.length === 0 && Number(req.params.id) === Number(requester.id)) {
    next();
    return;
  }

  let dbResponse = {};

  // Get user to be edited
  if (validationErrors.length === 0) {
    dbResponse = await rDatabaseApi.getUsers({ isForAuth: true, filters: query });
    validationErrors = validationErrors.concat(dbResponse.errors);
  }

  // User doesn't exist
  if (validationErrors.length === 0 && dbResponse?.results?.length === 0)
    validationErrors.push(errorMessages.USER_NOT_FOUND);

  // If there are multiple resources for id
  if (validationErrors.length === 0 && dbResponse?.results?.length > 1)
    validationErrors.push(errorMessages.UNEXPECTED_DATABASE_RESPONSE_ERROR);

  // If user has no privileges
  if (validationErrors.length === 0 && !utils.userHasPrivileges(requester, dbResponse?.results[0]))
    validationErrors.push(errorMessages.UNAUTHORIZED_API_CALL);

  // User has no privileges or errors occured
  if (validationErrors.length > 0) {
    const response = responseGenerators.patchUser({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  next();
}

export async function postUser(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;
  const parameters = req.body;

  // Check for role changing constraint
  if (utils.hasFieldWithValue(parameters, "role")) {
    if (requester.role === "admin" && parameters.role === "admin")
      validationErrors.push(errorMessages.INSUFFICIENT_PRIVILEGES);
    else if (requester.role === "moderator" && ["moderator", "admin"].includes(parameters.role))
      validationErrors.push(errorMessages.INSUFFICIENT_PRIVILEGES);
    else if (requester.role === "user") validationErrors.push(errorMessages.INSUFFICIENT_PRIVILEGES);
  }

  // Failed to pass
  if (validationErrors.length > 0) {
    const response = responseGenerators.postUser({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  next();
}
