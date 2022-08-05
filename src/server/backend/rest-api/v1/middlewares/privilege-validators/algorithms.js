import * as utils from '../../utils/utils';
import * as errorMessages from '../../messages/errors';
import * as responseGenerators from '../../response-generators/algorithms';
import * as handler from '../../handlers/algorithmsHandlers';

export async function getAlgorithms(req, res, next) {
  // Pass
  next();
}

export async function postAlgorithm(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;

  if (requester.role !== 'app') validationErrors.push(errorMessages.INSUFFICIENT_PRIVILEGES);

  // User has no privileges or errors occured
  if (validationErrors.length > 0) {
    const response = responseGenerators.postAlgorithm({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }
  // Pass
  next();
}

export async function deleteAlgorithm(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;

  if (requester.role !== 'app') validationErrors.push(errorMessages.INSUFFICIENT_PRIVILEGES);

  // User has no privileges or errors occured
  if (validationErrors.length > 0) {
    const response = responseGenerators.deleteAlgorithm({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }
  // Pass
  next();
}

export async function patchAlgorithm(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;

  if (requester.role !== 'app') validationErrors.push(errorMessages.INSUFFICIENT_PRIVILEGES);

  // User has no privileges or errors occured
  if (validationErrors.length > 0) {
    const response = responseGenerators.patchAlgorithm({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }
  // Pass
  next();
}
