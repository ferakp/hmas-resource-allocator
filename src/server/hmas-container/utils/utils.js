const axios = require('axios').default;
import jsonwebtoken from 'jsonwebtoken';
import * as backendApi from '../api/backend-api';
import * as logger from '../logger/logger';

/**
 * AJAX CALLS
 */

const host = process.env.REST_API_HOST;
const port = process.env.REST_API_PORT;

export const login = async (username, password) => {
  try {
    return await axios({
      url: 'http://' + host + ':' + port + '/api/v1/auth/login',
      method: 'get',
      headers: {
        Authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
      },
    });
  } catch (err) {
    return err;
  }
};

export const get = async (path, query, token) => {
  try {
    return await axios({
      url: 'http:// ' + host + ':' + port + '/api/v1/' + path + '/' + query,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  } catch (err) {
    return err;
  }
};

export const post = async (path, token, reqParams) => {
  try {
    return await axios({
      url: 'http:// ' + host + ':' + port + '/api/v1/' + path,
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: reqParams,
    });
  } catch (err) {
    return err;
  }
};

export const patch = async (path, token, reqParams) => {
  try {
    return await axios({
      url: 'http:// ' + host + ':' + port + '/api/v1/' + path,
      method: 'patch',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: reqParams,
    });
  } catch (err) {
    return err;
  }
};

export const del = async (path, token) => {
  try {
    return await axios({
      url: 'http:// ' + host + ':' + port + '/api/v1/' + path,
      method: 'delete',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  } catch (err) {
    return err;
  }
};

export const wait = async (seconds) => {
  await new Promise((r) => setTimeout(r, seconds * 1000));
};

export async function verifyToken(token, secretKey) {
  return jsonwebtoken.verify(token, secretKey, async (err, payload) => {
    // Invalid user token
    if (err) {
      return null;
    }

    return payload;
  });
}

/**
 * CHECKING FOR ERRORS
 */

export function hasError(result, errorTitle) {
  if (result.data.errors.lengh === 0) throw Error();
  else {
    // Response has an error
    expect(result.data.errors.length).toBe(1);

    // Response contains no data object
    expect(result.data.data.length).toBe(0);

    // Response has correct holon
    expect(result.data.errors[0].title).toBe(errorTitle);
  }
}

/**
 * DATE
 */

export function isDate(param) {
  if (param instanceof Date && !isNaN(param)) {
    return true;
  } else return false;
}

/**
 * DATA
 */

export async function updateResources(resourceName, resources) {
  const responseDetails = resources;
  let response = null;
  switch (resourceName) {
    case 'holons':
      response = await backendApi.updateHolons(resources.map((h) => h.id));
      break;
    case 'tasks':
      response = await backendApi.updateTasks(resources.map((h) => h.id));
      break;
    case 'allocations':
      response = await backendApi.updateAllocations(resources.map((h) => h.id));
      break;
  }

  if (response) {
    // There are updated resources
    if (response.updatedResources.length > 0) {
      response.updatedResources.forEach((resource) => {
        responseDetails = responseDetails.map((r) => {
          if (Number(r.id) === Number(resource.id)) return resource;
          else return r;
        });
      });
    }

    // There are deleted resources
    if (response.deletedIds.length > 0) {
      response.deletedIds.forEach((id) => {
        responseDetails.forEach((res, i) => {
          if (Number(res.id) === Number(id)) responseDetails.splice(i, 1);
        });
      });
    }
  }

  return responseDetails;
}

/**
 * FORMATTING
 */

export function formatHolonObject(holon) {
  const h = JSON.parse(JSON.stringify(holon));
  if (!isNumber(h.id) || !isDate(h.created_on) || !isDate(h.updated_on) || !isNumber(h.created_by)) throw new Error();

  h.id = Number(h.id);
  if (!h.type) h.type = null;
  if (!h.name) h.name = null;
  if (!h.gender) h.gender = null;
  if (!isNumber(h.daily_work_hours)) h.daily_work_hours = 0;
  else h.daily_work_hours = Number(h.daily_work_hours);
  if (!h.remote_address) h.remote_address = null;
  if (!h.api_token) h.api_token = null;

  if (!h.availability_data) h.availability_data = { currentValue: 0, records: [] };
  else h.availability_data = JSON.parse(h.availability_data);

  if (!h.load_data) h.load_data = { currentValue: 0, records: [] };
  else h.load_data = JSON.parse(h.load_data);

  if (!h.stress_data) h.stress_data = { currentValue: 0, records: [] };
  else h.stress_data = JSON.parse(h.stress_data);

  if (!h.cost_data) h.cost_data = { currentValue: 0, records: [] };
  else h.cost_data = JSON.parse(h.cost_data);

  if (!isNumber(h.age)) h.age = null;
  else h.age = Number(h.age);
  if (!h.experience_years) h.experience_years = null;
  else h.experience_years = Number(h.experience_years);
  if (!isDate(h.created_on)) h.created_on = null;
  else h.created_on = new Date(h.created_on);
  if (!isDate(h.updated_on)) h.updated_on = null;
  else h.updated_on = new Date(h.updated_on);
  if (!isNumber(h.created_by)) h.created_by = null;
  else h.created_by = new Date(h.created_by);

  if (!h.latest_state) {
    h.latest_state = {
      status: holonStatus.na,
      type: holonTypes.na,
      position: holonPosition.na,
      parentHolon: null,
      childHolons: [],
      numberOfReadMessages: 0,
      numberOfPerceptions: 0,
    };
  } else {
    h.latest_state = JSON.parse(h.latest_state);
  }

  return h;
}

export function isNumber(field) {
  return !isNaN(Number(field));
}

export function isDate(param) {
  if (param instanceof Date && !isNaN(param)) {
    return true;
  } else return false;
}


/**
 * LOGGER
 */

export function log(type, message) {
  logger.createLog(type, message);
}