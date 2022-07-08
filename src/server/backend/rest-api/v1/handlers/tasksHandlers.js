import * as rDatabaseApi from '../../../relational-database-api/api';
import * as utils from '../utils/utils';
import * as errorMessages from '../messages/errors';
import * as actions from '../messages/actions';
import * as requestConstraints from '../request-constraints/tasks';
import * as responseGenerator from '../response-generators/tasks';

/**
 * GET /tasks and /tasks/:id
 */

export async function getTasks(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let query = JSON.parse(JSON.stringify(req.query));
  const requester = req.requester;
  utils.hasFieldWithValue(req.params, 'id') ? (query.id = req.params.id) : '';

  // Formatting
  const formatResponse = utils.formatRequestQuery(query, requestConstraints.allFieldNames, requestConstraints.allFieldConstraints);
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else query = formatResponse.formattedQuery;

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Get tasks with given details
    const { errors, results } = await rDatabaseApi.getTasks({ filters: query });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Return error if search was conducted on :id which doesn't exist
  if (utils.hasFieldWithValue(req.params, 'id') && responseDetails.errors.length === 0 && responseDetails.results.length === 0) {
    responseDetails.errors.push(errorMessages.TASK_NOT_FOUND);
  }

  // Generate response
  const response = responseGenerator.getTasks(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * POST /tasks/:id
 */

export async function postTask(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let reqParams = JSON.parse(JSON.stringify(req.body));
  const requester = req.requester;

  // Fill missing fields
  if (!reqParams.hasOwnProperty('knowledge_tags')) reqParams['knowledge_tags'] = JSON.stringify({ tags: [] });
  if (!reqParams.hasOwnProperty('resource_demand')) reqParams['resource_demand'] = JSON.stringify({ demands: [] });
  if (!reqParams.hasOwnProperty('assigned_to')) reqParams['assigned_to'] = JSON.stringify({ ids: [] });
  reqParams['created_on'] = new Date();
  reqParams['updated_on'] = new Date();
  reqParams['created_by'] = requester.id;

  // Formatting
  const formatResponse = utils.formatRequestQuery(reqParams, requestConstraints.allFieldNames, requestConstraints.allFieldConstraints);
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else reqParams = formatResponse.formattedQuery;

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Create task
    const { errors, results } = await rDatabaseApi.createTask({ reqParams });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = responseGenerator.postTask(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * PATCH /tasks/:id
 */

export async function patchTask(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let reqParams = JSON.parse(JSON.stringify(req.body));
  const requester = req.requester;
  utils.hasFieldWithValue(req.params, 'id') ? (reqParams.id = req.params.id) : '';

  // Fill missing fields
  reqParams['updated_on'] = new Date();

  // Formatting
  const formatResponse = utils.formatRequestQuery(reqParams, requestConstraints.allFieldNames, requestConstraints.allFieldConstraints);
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else reqParams = formatResponse.formattedQuery;

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Edit task
    const { errors, results } = await rDatabaseApi.editTask({ reqParams });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = responseGenerator.patchTask(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * DELETE /tasks/:id
 */
export async function deleteTask(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let reqParams = {};
  const requester = req.requester;
  reqParams.id = req.params.id;

  // Formatting
  const formatResponse = utils.formatRequestQuery(reqParams, requestConstraints.allFieldNames, requestConstraints.allFieldConstraints);
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else reqParams = formatResponse.formattedQuery;

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Delete task
    const { errors, results } = await rDatabaseApi.deleteTask({ reqParams });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = responseGenerator.deleteTask(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}
