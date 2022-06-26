import * as rDatabaseApi from "../../../relational-database-api/api";
import * as statusResponseGenerators from "../response-generators/status";

/**
 * Handler for /status request
 * Returns status of REST API and Database API
 * @param {*} req 
 * @param {*} res 
 */
export async function status(req, res) {
  const responseDetails = { req, res, errors: [], responses: { "REST API": "active", "Database API": "inactive" } };

  // Get database status
  const databaseResponse = await rDatabaseApi.getStatus();

  // If database API is inactive
  if (databaseResponse.errors.length > 0) {
    responseDetails.errors = responseDetails.errors.concat(databaseResponse.errors);
    const response = statusResponseGenerators.status(responseDetails);
    res.status(200);
    res.json(response);
  }

  // If database API is active
  if (databaseResponse.results.length > 0) {
    responseDetails.responses["Database API"] = "active";
    const response = statusResponseGenerators.status(responseDetails);
    res.status(200);
    res.json(response);
  }
}
