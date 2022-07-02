import * as utils from '../../utils/utils';
import * as errorMessages from '../../messages/errors';
import * as responseGenerators from '../../response-generators/settings';
import * as rDatabaseApi from '../../../../relational-database-api/api';

export async function getSettings(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;
  const query = { id: Number(req.params.id) };

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

  let userResponse;
  if (validationErrors.length === 0 && results.length === 1) {
    userResponse = await rDatabaseApi.getUsers({ isForAuth: true, filters: { id: Number(results[0].created_by) } });
    validationErrors = validationErrors.concat(userResponse.errors);
  }

  // Path /settings/:id does not have owner
  if (validationErrors.length === 0 && userResponse?.results.length === 0) {
    validationErrors.push(errorMessages.USER_NOT_FOUND);
  }

  // If there are multiple users
  if (validationErrors === 0 && userResponse?.results.length > 1) {
    validationErrors.push(errorMessages.UNEXPECTED_DATABASE_RESPONSE_ERROR);
  }

  // If user has no privileges
  if (validationErrors.length === 0 && !utils.userHasPrivileges(requester, userResponse.results[0])) validationErrors.push(errorMessages.UNAUTHORIZED_API_CALL);

  // User has no privileges or errors occured
  if (validationErrors.length > 0) {
    const response = responseGenerators.getSettings({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export async function postSettings(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;

  const { errors, results } = await rDatabaseApi.getSettings({ requester, filters: { created_by: requester.id } });
  validationErrors = errors;

  // Path /settings/:id exists
  if (validationErrors.length === 0 && results.length > 0) {
    validationErrors.push(errorMessages.DUPLICATE_SETTINGS_NOT_ALLOWED);
  }

  // User has settings or errors occured
  if (validationErrors.length > 0) {
    const response = responseGenerators.postSettings({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export async function deleteSettings(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;
  const query = { id: Number(req.params.id) };

  // Get settings
  const settingsResponse = await rDatabaseApi.getSettings({ isForAuth: true, filters: query });

  // Settings not found
  if (settingsResponse.results.length !== 1) {
    validationErrors.push(errorMessages.SETTINGS_NOT_FOUND);
  } else {
    // Get user associated with settings
    const userResponse = await rDatabaseApi.getUsers({
      isForAuth: true,
      filters: { id: Number(settingsResponse.results[0].created_by) },
    });
    // Check if permission validator returns errors
    validationErrors = validationErrors.concat(utils.hasPermissionToEdit({ requester, resourceOwner: userResponse.results[0] }));
  }

  // User has no privileges or errors occured
  if (validationErrors.length > 0) {
    const response = responseGenerators.patchSettings({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }
  // Pass
  next();
}

export async function patchSettings(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;
  const query = { id: Number(req.params.id) };

  // Get settings
  const settingsResponse = await rDatabaseApi.getSettings({ isForAuth: true, filters: query });

  // Settings not found
  if (settingsResponse.results.length !== 1) {
    validationErrors.push(errorMessages.SETTINGS_NOT_FOUND);
  } else {
    // Get user associated with settings
    const userResponse = await rDatabaseApi.getUsers({
      isForAuth: true,
      filters: { id: Number(settingsResponse.results[0].created_by) },
    });
    // Check if permission validator returns errors
    validationErrors = validationErrors.concat(utils.hasPermissionToEdit({ requester, resourceOwner: userResponse.results[0] }));
  }

  // User has no privileges or errors occured
  if (validationErrors.length > 0) {
    const response = responseGenerators.patchSettings({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}
