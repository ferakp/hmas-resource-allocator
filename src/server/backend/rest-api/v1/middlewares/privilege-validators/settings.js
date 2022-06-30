import * as utils from '../../utils/utils';
import * as errorMessages from '../../messages/errors';
import * as responseGenerators from '../../response-generators/settings';
import * as rDatabaseApi from '../../../../relational-database-api/api';

export async function getSettings(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;
  const query = { id: req.params.id };

  // If requester is requesting own user
  if (Number(req.params.id) === Number(requester.id)) {
    next();
    return;
  }

  const { errors, results } = await rDatabaseApi.getSettings({ isForAuth: true, filters: query });
  validationErrors = errors;

  // Path /settings/:id doesn't exist
  if (validationErrors.length === 0 && results.length === 0) {
    validationErrors.push(errorMessages.SETTINGS_NOT_FOUND);
  }

  // If there are multiple resources
  if (validationErrors.length === 0 && results.length > 1) {
    validationErrors.push(errorMessages.UNEXPECTED_DATABASE_RESPONSE_ERROR);
  }

  const userResponse = await rDatabaseApi.getUsers({ isForAuth: true, filters: { id: Number(results[0].created_by) } });
  validationErrors = validationErrors.concat(userResponse.errors);

  // Path /settings/:id does not have owner
  if (validationErrors.length === 0 && userResponse.results.length === 0) {
    validationErrors.push(errorMessages.USER_NOT_FOUND);
  }

  // If there are multiple users
  if (validationErrors === 0 && userResponse.results.length > 1) {
    validationErrors.push(errorMessages.UNEXPECTED_DATABASE_RESPONSE_ERROR);
  }

  // If user has no privileges
  if (validationErrors.length === 0 && !utils.userHasPrivileges(requester, userResponse.results[0])) validationErrors.push(errorMessages.UNAUTHORIZED_API_CALL);

  // User has no privileges or errors occured
  if (validationErrors.length > 0) {
    const response = responseGenerators.getUsers({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export async function postSettings(req, res, next) {
  // Pass
  next();
}

export async function deleteSettings(req, res, next) {
  // Pass
  next();
}

export async function patchSettings(req, res, next) {
  // Pass
  next();
}
