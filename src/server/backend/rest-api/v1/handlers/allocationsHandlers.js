import * as rDatabaseApi from '../../../relational-database-api/api';
import * as utils from '../utils/utils';
import * as errorMessages from '../messages/errors';
import * as actions from '../messages/actions';
import * as requestConstraints from '../request-constraints/allocations';
import * as responseGenerator from '../response-generators/allocations';

/**
 * GET /allocations and /allocations/:id
 */

export async function getAllocations(req, res) {
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
    // Get allocations with given details
    const { errors, results } = await rDatabaseApi.getAllocations({ filters: query });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = responseGenerator.getAllocations(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * POST /allocations/:id and /allocations/:id/complete-requests
 */

export async function postAllocation(req, res) {}

export async function postAllocationCompleteRequests(req, res) {}

/**
 * PATCH /allocations/:id
 */

export async function patchAllocation(req, res) {}

/**
 * DELETE /allocations/:id
 */
export async function deleteAllocation(req, res) {}
