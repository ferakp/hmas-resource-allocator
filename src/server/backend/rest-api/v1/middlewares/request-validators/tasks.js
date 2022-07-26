import * as utils from '../../utils/utils';
import * as errorMessages from '../../messages/errors';
import * as responseGenerators from '../../response-generators/tasks';
import * as requestConstraints from '../../request-constraints/tasks';

const allFieldNames = requestConstraints.allFieldNames;
const allFieldConstraints = requestConstraints.allFieldConstraints;

export function getTasks(req, res, next) {
  const query = JSON.parse(JSON.stringify(req.query));
  // If path is tasks/:id
  if (utils.hasFieldWithValue(req.params, 'id')) query.id = req.params.id;
  const acceptedFieldNames = requestConstraints.getTasks.acceptedFieldNames;

  const errors = utils.getRequestValidationCheck({
    query: query || {},
    acceptedFieldNames: acceptedFieldNames || [],
    allFieldNames: allFieldNames || {},
    allFieldConstraints: allFieldConstraints || [],
  });

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.getTasks({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function deleteTask(req, res, next) {
  const query = {};
  const errors = utils.deleteRequestValidationCheck({ id: req.params.id, allFieldNames, allFieldConstraints });

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.deleteTask({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function patchTask(req, res, next) {
  const reqParams = JSON.parse(JSON.stringify(req.body));
  const acceptedFieldNames = requestConstraints.patchTask.acceptedFieldNames;

  const errors = utils.patchRequestValidationCheck({
    reqParams,
    acceptedFieldNames,
    allFieldConstraints,
    allFieldNames,
    id: req.params.id,
  });

  // Validate content of knowledge tags and resource demand
  // Resource demand has assigned_to, structure of type, experience_years and knowledge_tags
  if (errors.length === 0) {
    try {
      if (reqParams.hasOwnProperty('assigned_to') && !Array.isArray(JSON.parse(reqParams['assigned_to']).ids)) throw new Error();
      if (reqParams.hasOwnProperty('knowledge_tags') && !Array.isArray(JSON.parse(reqParams['knowledge_tags']).tags)) throw new Error();
      if (reqParams.hasOwnProperty('resource_demand') && !Array.isArray(JSON.parse(reqParams['resource_demand']).demands)) throw new Error();

      if (reqParams.hasOwnProperty('assigned_to')) {
        const assignedTo = JSON.parse(reqParams['assigned_to']).ids;
        if (assignedTo.length !== 0 && !utils.isArrayElementsNumber(assignedTo)) throw new Error();
      }

      if (reqParams.hasOwnProperty('knowledge_tags')) {
        const tags = JSON.parse(reqParams['knowledge_tags']).tags;
        if (tags.length !== 0 && !utils.isArrayElementsString(tags)) throw new Error();
      }

      // resource_demand.demands is an array in which every element is an array as well
      // each element consist of type (string), experience_years(number), knowledge_tags (array)
      if (reqParams.hasOwnProperty('resource_demand')) {
        const demands = JSON.parse(reqParams['resource_demand']).demands;
        if (demands.length !== 0)
          demands.forEach((e) => {
            if (
              !e ||
              !Array.isArray(e) ||
              e.length !== 3 ||
              !e[0] ||
              typeof e[0] !== 'string' ||
              !utils.isFieldNumber(e[1]) ||
              !e[2] ||
              !Array.isArray(e[2]) ||
              !utils.isArrayElementsString(e[2])
            ) {
              throw new Error();
            }
          });
      }
    } catch (err) {
      errors.push(errorMessages.INVALID_PARAMETER_VALUES);
    }
  }

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.patchTask({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}

export function postTask(req, res, next) {
  const reqParams = JSON.parse(JSON.stringify(req.body));
  const acceptedFieldNames = requestConstraints.postTask.acceptedFieldNames;
  const requiredFieldNames = requestConstraints.postTask.requiredFieldNames;

  const errors = utils.postRequestValidationCheck({
    reqParams,
    acceptedFieldNames,
    allFieldConstraints,
    allFieldNames,
    requiredFieldNames,
  });

  // Validate content of knowledge tags and resource demand
  // Resource demand has assigned_to, structure of type, experience_years and knowledge_tags
  if (errors.length === 0) {
    try {
      if (reqParams.hasOwnProperty('assigned_to') && !Array.isArray(JSON.parse(reqParams['assigned_to']).ids)) throw new Error();
      if (reqParams.hasOwnProperty('knowledge_tags') && !Array.isArray(JSON.parse(reqParams['knowledge_tags']).tags)) throw new Error();
      if (reqParams.hasOwnProperty('resource_demand') && !Array.isArray(JSON.parse(reqParams['resource_demand']).demands)) throw new Error();

      if (reqParams.hasOwnProperty('assigned_to')) {
        const assignedTo = JSON.parse(reqParams['assigned_to']).ids;
        if (!utils.isArrayElementsNumber(assignedTo)) throw new Error();
      }

      if (reqParams.hasOwnProperty('knowledge_tags')) {
        const tags = JSON.parse(reqParams['knowledge_tags']).tags;
        if (!utils.isArrayElementsString(tags)) throw new Error();
      }

      if (reqParams.hasOwnProperty('resource_demand')) {
        const demands = JSON.parse(reqParams['resource_demand']).demands;
        demands.forEach((e) => {
          if (
            !e ||
            !Array.isArray(e) ||
            e.length !== 3 ||
            !e[0] ||
            typeof e[0] !== 'string' ||
            !utils.isFieldNumber(e[1]) ||
            !e[2] ||
            !Array.isArray(e[2]) ||
            !utils.isArrayElementsString(e[2])
          ) {
            throw new Error();
          }
        });
      }
    } catch (err) {
      errors.push(errorMessages.INVALID_PARAMETER_VALUES);
    }
  }

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.patchTask({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}
