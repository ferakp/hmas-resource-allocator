import * as utils from '../../utils/utils';
import * as responseGenerators from '../../response-generators/algorithms';
import * as requestConstraints from '../../request-constraints/algorithms';

const allFieldNames = requestConstraints.allFieldNames;
const allFieldConstraints = requestConstraints.allFieldConstraints;

export function getAlgorithms(req, res, next) {
  const query = JSON.parse(JSON.stringify(req.query));
  // If path is algorithms/:id
  if (utils.hasFieldWithValue(req.params, 'id')) query.id = req.params.id;
  const acceptedFieldNames = requestConstraints.getAlgorithms.acceptedFieldNames;

  const errors = utils.getRequestValidationCheck({
    query: query || {},
    acceptedFieldNames: acceptedFieldNames || [],
    allFieldNames: allFieldNames || {},
    allFieldConstraints: allFieldConstraints || [],
  });

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.getAlgorithms({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }
  // Pass
  next();
}

export function deleteAlgorithm(req, res, next) {
  const reqParams = JSON.parse(JSON.stringify(req.body));
  const errors = utils.deleteRequestValidationCheck({ id: req.params.id, allFieldNames, allFieldConstraints });

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.deleteAlgorithm({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function patchAlgorithm(req, res, next) {
  const reqParams = JSON.parse(JSON.stringify(req.body));
  const acceptedFieldNames = requestConstraints.patchAlgorithm.acceptedFieldNames;

  const errors = utils.patchRequestValidationCheck({
    reqParams,
    acceptedFieldNames,
    allFieldConstraints,
    allFieldNames,
    id: req.params.id,
  });

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.patchAlgorithm({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function postAlgorithm(req, res, next) {
  const reqParams = JSON.parse(JSON.stringify(req.body));
  const acceptedFieldNames = requestConstraints.postAlgorithm.acceptedFieldNames;
  const requiredFieldNames = requestConstraints.postAlgorithm.requiredFieldNames;

  const errors = utils.postRequestValidationCheck({
    reqParams,
    acceptedFieldNames,
    allFieldConstraints,
    allFieldNames,
    requiredFieldNames,
  });

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.postAlgorithm({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}
