import * as rDatabaseApi from '../../../relational-database-api/api';
import * as utils from '../utils/utils';
import * as requestConstraints from '../request-constraints/algorithms';
import * as responseGenerator from '../response-generators/algorithms';
import * as errorMessages from '../messages/errors';

/**
 * GET /algorithms and /algorithms/:id
 */

export async function getAlgorithms(req, res) {
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
    // Get algorithms with given details
    const { errors, results } = await rDatabaseApi.getAlgorithms({ filters: query });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Return error if search was conducted on :id which doesn't exist
  if (utils.hasFieldWithValue(req.params, 'id') && responseDetails.errors.length === 0 && responseDetails.results.length === 0) {
    responseDetails.errors.push(errorMessages.ALGORITHM_NOT_FOUND);
  }

  // Generate response
  const response = responseGenerator.getAlgorithms(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * POST /algorithms/:id
 */

export async function postAlgorithm(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let reqParams = JSON.parse(JSON.stringify(req.body));
  const requester = req.requester;

  // Fill missing fields
  reqParams['updated_on'] = new Date();
  reqParams['created_on'] = new Date();
  reqParams['created_by'] = Number(requester.id);

  // Formatting
  const formatResponse = utils.formatRequestQuery(reqParams, requestConstraints.allFieldNames, requestConstraints.allFieldConstraints);
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else reqParams = formatResponse.formattedQuery;

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Create an algorithm
    const { errors, results } = await rDatabaseApi.createAlgorithm({ reqParams });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = responseGenerator.postAlgorithm(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * PATCH /algorithms/:id
 */

export async function patchAlgorithm(req, res) {
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
    // Edit the algorithm
    const { errors, results } = await rDatabaseApi.editAlgorithm({ reqParams });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = responseGenerator.patchAlgorithm(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * DELETE /algorithms/:id
 */
export async function deleteAlgorithm(req, res) {
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
    // Delete the algorithm
    const { errors, results } = await rDatabaseApi.deleteAlgorithm({ reqParams });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Empty response means allocation didn't exist
  if (responseDetails.errors.length === 0 && responseDetails.results.length === 0) {
    responseDetails.errors.push(errorMessages.ALGORITHM_NOT_FOUND);
  }

  // Generate response
  const response = responseGenerator.deleteAlgorithm(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}
