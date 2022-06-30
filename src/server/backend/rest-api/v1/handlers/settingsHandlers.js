import * as rDatabaseApi from '../../../relational-database-api/api';
import * as utils from '../utils/utils';
import * as errorMessages from '../messages/errors';
import * as actions from '../messages/actions';
import * as requestConstraints from '../request-constraints/settings';
import * as responseGenerator from '../response-generators/settings';

/**
 * GET /settings and /settings/:id
 */

export async function getSettings(req, res) {
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
    // Get users with given details
    const { errors, results } = await rDatabaseApi.getSettings({ requester, filters: query });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = responseGenerator.getSettings(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * POST /settings/:id
 */

export async function postSettings(req, res) {}

/**
 * PATCH /settings/:id
 */

export async function patchSettings(req, res) {}

/**
 * DELETE /settings/:id
 */
export async function deleteSettings(req, res) {}
