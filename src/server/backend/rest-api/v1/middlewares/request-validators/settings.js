import * as utils from '../../utils/utils';
import * as errorMessages from '../../messages/errors';
import * as responseGenerators from '../../response-generators/settings';
import * as requestConstraints from '../../request-constraints/settings';

const allFieldNames = requestConstraints.allFieldNames;
const allFieldConstraints = requestConstraints.allFieldConstraints;

export function getSettings(req, res, next) {
  const query = JSON.parse(JSON.stringify(req.query));
  // If path is settings/:id
  if (utils.hasFieldWithValue(req.params, 'id')) query.id = req.params.id;
  const acceptedFieldNames = requestConstraints.getSettings.acceptedFieldNames;

  const errors = utils.getRequestValidationCheck({
    query: query || {},
    acceptedFieldNames: acceptedFieldNames || [],
    allFieldNames: allFieldNames || {},
    allFieldConstraints: allFieldConstraints || [],
  });

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.getSettings({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function deleteSettings(req, res, next) {
  const reqParams = JSON.parse(JSON.stringify(req.body));
  const errors = utils.deleteRequestValidationCheck({ id: req.params.id, allFieldNames, allFieldConstraints });

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.deleteSettings({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function patchSettings(req, res, next) {
  const reqParams = JSON.parse(JSON.stringify(req.body));
  const acceptedFieldNames = requestConstraints.patchSettings.acceptedFieldNames;

  const errors = utils.patchRequestValidationCheck({
    reqParams,
    acceptedFieldNames,
    allFieldConstraints,
    allFieldNames,
    id: req.params.id,
  });

  // Settings should have not more than 100 fields
  try {
    const settings = JSON.parse(reqParams['settings']);
    if (Object.keys(settings).length > 99) errors.push(errorMessages.MAX_SETTINGS_SIZE_EXCEEDED);
    else if (Object.keys(settings).length === 0) errors.push(errorMessages.MISSING_SETTINGS);
  } catch (err) {
    errors.push(errorMessages.INVALID_PARAMETER_VALUES);
  }

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.patchSettings({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function postSettings(req, res, next) {
  const reqParams = JSON.parse(JSON.stringify(req.body));
  const acceptedFieldNames = requestConstraints.postSettings.acceptedFieldNames;
  const requiredFieldNames =  requestConstraints.postSettings.requiredFieldNames;

  const errors = utils.postRequestValidationCheck({
    reqParams,
    acceptedFieldNames,
    allFieldConstraints,
    allFieldNames,
    requiredFieldNames,
  });

  // Settings should have not more than 100 fields
  try {
    const settings = JSON.parse(reqParams['settings']);
    if (Object.keys(settings).length > 99) errors.push(errorMessages.MAX_SETTINGS_SIZE_EXCEEDED);
    else if (Object.keys(settings).length === 0) errors.push(errorMessages.MISSING_SETTINGS);
  } catch (err) {
    errors.push(errorMessages.INVALID_PARAMETER_VALUES);
  }

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.patchSettings({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }
  // Pass
  next();
}
