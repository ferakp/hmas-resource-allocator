import * as rDatabaseApi from '../../../relational-database-api/api';
import * as utils from '../utils/utils';
import * as errorMessages from '../messages/errors';
import * as requestConstraints from '../request-constraints/search';
import * as responseGenerator from '../response-generators/search';

/**
 * POST /search
 */

export async function postSearch(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let reqParams = JSON.parse(JSON.stringify(req.body));
  const requester = req.requester;

  // Formatting
  const formatResponse = utils.formatRequestQuery(reqParams, requestConstraints.allFieldNames, requestConstraints.allFieldConstraints);
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else reqParams = formatResponse.formattedQuery;
  // Check ids field and assure they are numbers
  try {
    reqParams.ids = reqParams.ids.map((e) => {
      if (utils.isFieldNumber(e)) return Number(e);
      else throw new Error();
    });
  } catch (err) {
    responseDetails.errors.push(errorMessages.INVALID_PARAMETER_VALUES);
  }

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Get search resources
    const { errors, results } = await rDatabaseApi.search({ requester, reqParams });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // If error has not occured
  if (responseDetails.errors.length === 0 && responseDetails.results.length > 0) {
    // Bulk update check
    if (reqParams.type === 'bulk-update-check') {
      const responseTemplate = { updatedResources: [], deletedIds: [] };
      responseTemplate.deletedIds = utils.getDeletedIds(
        reqParams.ids,
        responseDetails.results.map((e) => e.id)
      );
      responseTemplate.updatedResources = utils.getUpdatedResources(reqParams.ids, responseDetails.results, reqParams.latest_update);
      responseDetails.results = responseTemplate;
    }
  }

  // Generate response
  responseDetails.reqParams = reqParams;
  const response = responseGenerator.postSearch(responseDetails);
  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}
