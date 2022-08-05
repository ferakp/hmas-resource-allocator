import * as utils from '../../utils/utils';
import * as errorMessages from '../../messages/errors';
import * as responseGenerators from '../../response-generators/allocations';
import * as requestConstraints from '../../request-constraints/allocations';

const allFieldNames = requestConstraints.allFieldNames;
const allFieldConstraints = requestConstraints.allFieldConstraints;

export function getAllocations(req, res, next) {
  const query = JSON.parse(JSON.stringify(req.query));
  // If path is allocations/:id
  if (utils.hasFieldWithValue(req.params, 'id')) query.id = req.params.id;
  const acceptedFieldNames = requestConstraints.getAllocations.acceptedFieldNames;

  const errors = utils.getRequestValidationCheck({
    query: query || {},
    acceptedFieldNames: acceptedFieldNames || [],
    allFieldNames: allFieldNames || {},
    allFieldConstraints: allFieldConstraints || [],
  });

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.getAllocations({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function deleteAllocation(req, res, next) {
  const query = {};
  const errors = utils.deleteRequestValidationCheck({ id: req.params.id, allFieldNames, allFieldConstraints });

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.deleteAllocation({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function patchAllocation(req, res, next) {
  const reqParams = JSON.parse(JSON.stringify(req.body));
  const acceptedFieldNames = requestConstraints.patchAllocation.acceptedFieldNames;

  const errors = utils.patchRequestValidationCheck({
    reqParams,
    acceptedFieldNames,
    allFieldConstraints,
    allFieldNames,
    id: req.params.id,
  });

  // Validate result parameter
  // The result parameter is JSON and is should have either error or allocations property
  if (errors.length === 0 && reqParams.result) {
    try {
      const result = JSON.parse(reqParams.result);
      if (!result.error) {
        if (!result.allocations || !Array.isArray(result.allocations)) throw new Error();
        result.allocations.forEach((alloc) => {
          if (!utils.isNumber(alloc.taskId)) throw new Error();
          if (!Array.isArray(alloc.holonIds)) throw new Error();
        });
      }
    } catch (err) {
      errors.push(errorMessages.INVALID_PARAMETER_VALUES);
    }
  }

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.patchAllocation({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function postAllocation(req, res, next) {
  const reqParams = JSON.parse(JSON.stringify(req.body));
  const acceptedFieldNames = requestConstraints.postAllocation.acceptedFieldNames;
  const requiredFieldNames = requestConstraints.postAllocation.requiredFieldNames;

  const errors = utils.postRequestValidationCheck({
    reqParams,
    acceptedFieldNames,
    allFieldConstraints,
    allFieldNames,
    requiredFieldNames,
  });

  // Check whether request field is correct (deep check)
  if (errors.length === 0) {
    try {
      const request = JSON.parse(reqParams.request);
      if (!request.algorithm) throw new Error();
      if (!request.holonIds || !Array.isArray(request.holonIds) || request.holonIds.length === 0) throw new Error();
      if (!request.taskIds || !Array.isArray(request.taskIds) || request.taskIds.length === 0) throw new Error();
    } catch (err) {
      errors.push(errorMessages.INVALID_PARAMETER_VALUES);
    }
  }

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.postAllocation({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function postAllocationCompleteRequests(req, res, next) {
  const query = {};
  // It uses same validation criterias as delete method
  const errors = utils.deleteRequestValidationCheck({ id: req.params.id, allFieldNames, allFieldConstraints });

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.postAllocationCompleteRequests({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }
  // Pass
  next();
}

export function postReallocateRequests(req, res, next) {
  const query = {};
  const errors = utils.deleteRequestValidationCheck({ id: req.params.id, allFieldNames, allFieldConstraints });

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.postReallocateRequests({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }
  // Pass
  next();
}
