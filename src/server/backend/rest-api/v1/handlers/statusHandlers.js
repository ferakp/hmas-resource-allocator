import * as rDatabaseApi from '../../../relational-database-api/api';
import * as statusResponseGenerators from '../response-generators/status';
import * as HMASContainerApi from '../../../hmas-container-api/api';

/**
 * Handler for /status request
 * Returns status of REST API, Database and HMAS Container
 * @param {*} req Express request object
 * @param {*} res Express respons ebject
 */
export async function status(req, res) {
  const responseDetails = { req, res, errors: [], responses: { 'REST API': 'active', Database: 'inactive', 'HMAS Container': 'inactive' } };

  // Get database status
  const databaseResponse = await rDatabaseApi.getStatus();
  // Get HMAS Container status
  const HMASContainerResponse = await HMASContainerApi.getStatus();

  // If database API is active
  if (databaseResponse.results?.length > 0) {
    responseDetails.responses['Database'] = 'active';
  }

  // If HMAS Container API is active
  if (HMASContainerResponse.results?.length > 0) {
    responseDetails.responses['HMAS Container'] = HMASContainerResponse.results[0];
  }

  responseDetails.results = [responseDetails.responses];
  const response = statusResponseGenerators.status(responseDetails);
  res.status(200);
  res.json(response);
}
