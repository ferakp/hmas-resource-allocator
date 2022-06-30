import * as rDatabaseApi from '../../../relational-database-api/api';
import * as utils from '../utils/utils';
import * as requestConstraints from '../request-constraints/holons';
import * as responseGenerator from '../response-generators/holons';
import * as errorMessages from '../messages/errors';

export async function getHolons(req, res) {
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
  if (!reqParams.hasOwnProperty('daily_work_hours')) reqParams['daily_work_hours'] = 0;
  if (!reqParams.hasOwnProperty('availability_data')) reqParams['availability_data'] = JSON.stringify({ currentValue: 0, latestUpdate: new Date(), records: [] });
  else {
    reqParams['availability_data'] = JSON.stringify({
      currentValue: JSON.parse(reqParams['availability_data']).currentValue,
      latestUpdate: new Date(),
      records: [],
    });
  }
  if (!reqParams.hasOwnProperty('load_data')) reqParams['load_data'] = JSON.stringify({ currentValue: 0, latestUpdate: new Date(), records: [] });
  else {
    reqParams['load_data'] = JSON.stringify({
      currentValue: JSON.parse(reqParams['load_data']).currentValue,
      latestUpdate: new Date(),
      records: [],
    });
  }
  if (!reqParams.hasOwnProperty('stress_data')) reqParams['stress_data'] = JSON.stringify({ currentValue: 0, latestUpdate: new Date(), records: [] });
  else {
    reqParams['stress_data'] = JSON.stringify({
      currentValue: JSON.parse(reqParams['stress_data']).currentValue,
      latestUpdate: new Date(),
      records: [],
    });
  }
  if (!reqParams.hasOwnProperty('cost_data')) reqParams['cost_data'] = JSON.stringify({ currentValue: 0, latestUpdate: new Date(), records: [] });
  else {
    reqParams['cost_data'] = JSON.stringify({
      currentValue: JSON.parse(reqParams['cost_data']).currentValue,
      latestUpdate: new Date(),
      records: [],
    });
  }
  if (!reqParams.hasOwnProperty('experience_years')) reqParams['experience_years'] = 0;
  reqParams['created_on'] = new Date();
  reqParams['updated_on'] = new Date();
  reqParams['created_by'] = requester.id;

  // Formatting
  const formatResponse = utils.formatRequestQuery(reqParams, requestConstraints.allFieldNames, requestConstraints.allFieldConstraints);
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
  utils.hasFieldWithValue(req.params, 'id') ? (reqParams.id = req.params.id) : '';

  // Update cost_data, load_data, availability_data and stress_data
  try {
    if (
      reqParams.hasOwnProperty('load_data') ||
      reqParams.hasOwnProperty('stress_data') ||
      reqParams.hasOwnProperty('availability_data') ||
      reqParams.hasOwnProperty('cost_data')
    ) {
      const holonResult = await rDatabaseApi.getHolons({ filters: { id: reqParams.id } });

      if (holonResult.results.length !== 1) {
        responseDetails.errors.push(errorMessages.HOLON_NOT_FOUND);
      } else {

        //console.log("Holon result ", holonResult.results[0]);
        const holon = utils.formatAndFixHolonDataFields(holonResult.results[0]);
        const editHolon = reqParams;

        if (reqParams.hasOwnProperty('load_data')) {
          editHolon.load_data = JSON.parse(editHolon.load_data);
          holon.load_data.records.push([holon.load_data.currentValue, holon.load_data.latestUpdate]);
          holon.load_data.currentValue = editHolon.load_data.currentValue;
          holon.load_data.latestUpdate = new Date();
          holon.load_data = JSON.stringify(holon.load_data);
          editHolon.load_data = holon.load_data;
        }

        if (reqParams.hasOwnProperty('cost_data')) {
          editHolon.cost_data = JSON.parse(editHolon.cost_data);
          holon.cost_data.records.push([holon.cost_data.currentValue, holon.cost_data.latestUpdate]);
          holon.cost_data.currentValue = editHolon.cost_data.currentValue;
          holon.cost_data.latestUpdate = new Date();
          holon.cost_data = JSON.stringify(holon.cost_data);
          editHolon.cost_data = holon.cost_data;
        }

        if (reqParams.hasOwnProperty('availability_data')) {
          editHolon.availability_data = JSON.parse(editHolon.availability_data);
          holon.availability_data.records.push([holon.availability_data.currentValue, holon.availability_data.latestUpdate]);
          holon.availability_data.currentValue = editHolon.availability_data.currentValue;
          holon.availability_data.latestUpdate = new Date();
          holon.availability_data = JSON.stringify(holon.availability_data);
          editHolon.availability_data = holon.availability_data;
        }

        if (reqParams.hasOwnProperty('stress_data')) {
          editHolon.stress_data = JSON.parse(editHolon.stress_data);
          holon.stress_data.records.push([holon.stress_data.currentValue, holon.stress_data.latestUpdate]);
          holon.stress_data.currentValue = editHolon.stress_data.currentValue;
          holon.stress_data.latestUpdate = new Date();
          holon.stress_data = JSON.stringify(holon.stress_data);
          editHolon.stress_data = holon.stress_data;
        }
      }
    }
  } catch (err) {
    responseDetails.errors.push(errorMessages.UNEXPECTED_UPDATE_ERROR);
  }

  if (responseDetails.errors.length === 0) {
    // Mark holon as updated
    reqParams['updated_on'] = new Date();

    // Formatting
    const formatResponse = utils.formatRequestQuery(reqParams, requestConstraints.allFieldNames, requestConstraints.allFieldConstraints);
    if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
    else reqParams = formatResponse.formattedQuery;
  }

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
  const formatResponse = utils.formatRequestQuery(reqParams, requestConstraints.allFieldNames, requestConstraints.allFieldConstraints);
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
  const response = responseGenerator.deleteHolon(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}
