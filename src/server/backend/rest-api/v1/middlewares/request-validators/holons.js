import * as errorMessages from '../../messages/errors';
import * as utils from '../../utils/utils';
import * as requestConstraints from '../../request-constraints/holons';
import * as responseGenerators from '../../response-generators/holons';

const allFieldNames = requestConstraints.allFieldNames;
const allFieldConstraints = requestConstraints.allFieldConstraints;

export function getHolons(req, res, next) {
  const query = JSON.parse(JSON.stringify(req.query));
  // If path is holons/:id
  if (utils.hasFieldWithValue(req.params, 'id')) query.id = req.params.id;
  const acceptedFieldNames = requestConstraints.getHolons.acceptedFieldNames;

  const errors = utils.getRequestValidationCheck({
    query: query || {},
    acceptedFieldNames: acceptedFieldNames || [],
    allFieldNames: allFieldNames || {},
    allFieldConstraints: allFieldConstraints || [],
  });

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.getHolons({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function patchHolon(req, res, next) {
  const reqParams = JSON.parse(JSON.stringify(req.body));
  const acceptedFieldNames = requestConstraints.patchHolon.acceptedFieldNames;

  const errors = utils.patchRequestValidationCheck({
    reqParams,
    acceptedFieldNames,
    allFieldConstraints,
    allFieldNames,
    id: req.params.id,
  });

  // Validate content of availability_data, cost_data, load_data and stress_data
  // by assuring they have currentValue property with the type of number
  if (errors.length === 0) {
    try {
      if (reqParams.hasOwnProperty('availability_data') && !utils.isFieldNumber(JSON.parse(reqParams['availability_data']).currentValue)) throw new Error();
      if (reqParams.hasOwnProperty('load_data') && !utils.isFieldNumber(JSON.parse(reqParams['load_data']).currentValue)) throw new Error();
      if (reqParams.hasOwnProperty('stress_data') && !utils.isFieldNumber(JSON.parse(reqParams['stress_data']).currentValue)) throw new Error();
      if (reqParams.hasOwnProperty('cost_data') && !utils.isFieldNumber(JSON.parse(reqParams['stress_data']).currentValue)) throw new Error();
    } catch (err) {
      errors.push(errorMessages.INVALID_PARAMETER_VALUES);
    }
  }

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.patchHolon({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function postHolon(req, res, next) {
  const reqParams = JSON.parse(JSON.stringify(req.body));
  const acceptedFieldNames = requestConstraints.postHolon.acceptedFieldNames;
  const requiredFieldNames = ['type', 'name'];

  const errors = utils.postRequestValidationCheck({
    reqParams,
    acceptedFieldNames,
    allFieldConstraints,
    allFieldNames,
    requiredFieldNames,
  });

  // Validate availability_data, cost_data, load_data and stress_data if available
  if (errors.length === 0) {
    try {
      if (reqParams.hasOwnProperty('availability_data') && !utils.isFieldNumber(JSON.parse(reqParams['availability_data']).currentValue)) throw new Error();
      if (reqParams.hasOwnProperty('load_data') && !utils.isFieldNumber(JSON.parse(reqParams['load_data']).currentValue)) throw new Error();
      if (reqParams.hasOwnProperty('stress_data') && !utils.isFieldNumber(JSON.parse(reqParams['stress_data']).currentValue)) throw new Error();
      if (reqParams.hasOwnProperty('cost_data') && !utils.isFieldNumber(JSON.parse(reqParams['stress_data']).currentValue)) throw new Error();
    } catch (err) {
      errors.push(errorMessages.INVALID_PARAMETER_VALUES);
    }
  }

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.postHolon({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function deleteHolon(req, res, next) {
  const reqParams = JSON.parse(JSON.stringify(req.body));
  const errors = utils.deleteRequestValidationCheck({ id: req.params.id, allFieldNames, allFieldConstraints });

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.deleteHolon({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}
