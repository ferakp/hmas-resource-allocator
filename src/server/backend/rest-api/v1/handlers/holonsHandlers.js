import * as rDatabaseApi from "../../../relational-database-api/api";
import * as utils from "../utils/utils";
import * as requestConstraints from "../request-constraints/holons";
import * as responseGenerator from "../response-generators/holons";
import * as errorMessages from "../messages/errors";

export async function getHolons(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let query = JSON.parse(JSON.stringify(req.query));
  const requester = req.requester;
  utils.hasFieldWithValue(req.params, "id") ? (query.id = req.params.id) : "";

  // Formatting
  const formatResponse = utils.formatRequestQuery(
    query,
    requestConstraints.allFieldNames,
    requestConstraints.allFieldConstraints
  );
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else query = formatResponse.formattedQuery;

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Get holons with given details
    const { errors, results } = await rDatabaseApi.getHolons({ filters: query });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = responseGenerator.getHolons(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

export async function postHolon(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let reqParams = JSON.parse(JSON.stringify(req.body));
  const requester = req.requester;

  // Fill missing fields
  if (!reqParams.hasOwnProperty("daily_work_hours")) reqParams["daily_work_hours"] = 0;
  if (!reqParams.hasOwnProperty("availability_data"))
    reqParams["availability_data"] = JSON.stringify({ currentValue: 0, latestUpdate: new Date(), records: [] });
  else {
    reqParams["availability_data"] = JSON.stringify({
      currentValue: JSON.parse(reqParams["availability_data"]).currentValue,
      latestUpdate: new Date(),
      records: [],
    });
  }
  if (!reqParams.hasOwnProperty("load_data"))
    reqParams["load_data"] = JSON.stringify({ currentValue: 0, latestUpdate: new Date(), records: [] });
  else {
    reqParams["load_data"] = JSON.stringify({
      currentValue: JSON.parse(reqParams["load_data"]).currentValue,
      latestUpdate: new Date(),
      records: [],
    });
  }
  if (!reqParams.hasOwnProperty("stress_data"))
    reqParams["stress_data"] = JSON.stringify({ currentValue: 0, latestUpdate: new Date(), records: [] });
  else {
    reqParams["stress_data"] = JSON.stringify({
      currentValue: JSON.parse(reqParams["stress_data"]).currentValue,
      latestUpdate: new Date(),
      records: [],
    });
  }
  if (!reqParams.hasOwnProperty("cost_data"))
    reqParams["cost_data"] = JSON.stringify({ currentValue: 0, latestUpdate: new Date(), records: [] });
  else {
    reqParams["cost_data"] = JSON.stringify({
      currentValue: JSON.parse(reqParams["cost_data"]).currentValue,
      latestUpdate: new Date(),
      records: [],
    });
  }
  if (!reqParams.hasOwnProperty("experience_years")) reqParams["experience_years"] = 0;
  reqParams["created_on"] = new Date();
  reqParams["updated_on"] = new Date();
  reqParams["created_by"] = requester.id;

  // Formatting
  const formatResponse = utils.formatRequestQuery(
    reqParams,
    requestConstraints.allFieldNames,
    requestConstraints.allFieldConstraints
  );
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else reqParams = formatResponse.formattedQuery;

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Create holon
    const { errors, results } = await rDatabaseApi.createHolon({ reqParams });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = responseGenerator.postHolon(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

export async function patchHolon(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let reqParams = JSON.parse(JSON.stringify(req.body));
  const requester = req.requester;
  utils.hasFieldWithValue(req.params, "id") ? (reqParams.id = req.params.id) : "";

  // Mark holon as updated
  reqParams["updated_on"] = new Date();

  // Formatting
  const formatResponse = utils.formatRequestQuery(
    reqParams,
    requestConstraints.allFieldNames,
    requestConstraints.allFieldConstraints
  );
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else reqParams = formatResponse.formattedQuery;

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Edit holon
    const { errors, results } = await rDatabaseApi.editHolon({ reqParams });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = responseGenerator.patchHolon(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

export async function deleteHolon(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let reqParams = {};
  const requester = req.requester;
  reqParams.id = req.params.id;

  // Formatting
  const formatResponse = utils.formatRequestQuery(
    reqParams,
    requestConstraints.allFieldNames,
    requestConstraints.allFieldConstraints
  );
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else reqParams = formatResponse.formattedQuery;

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Edit holon
    const { errors, results } = await rDatabaseApi.deleteHolon({ reqParams });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = responseGenerator.patchHolon(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}
