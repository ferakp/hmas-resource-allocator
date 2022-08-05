const axios = require('axios').default;
import jsonwebtoken from 'jsonwebtoken';
import * as backendApi from '../api/backend-api';
import * as logger from '../logger/logger';

export let host = null;
export let port = null;
let protocol = 'http';

const configInterval = setInterval(() => {
  if (process.env.REST_API_HOST && process.env.REST_API_PORT && process.env.NODE_ENV) {
    host = process.env.REST_API_HOST;
    port = process.env.REST_API_PORT;
    protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    clearInterval(configInterval);
  }
}, 500);

/**
 * AJAX CALLS
 */

const checkConnectionParams = () => {
  if (!host || !port) return false;
  else return true;
};

export const login = async (username, password) => {
  try {
    if (!checkConnectionParams()) throw new Error();
    return await axios({
      url: protocol + '://' + host + ':' + port + '/api/v1/auth/login',
      method: 'get',
      headers: {
        Authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
      },
    });
  } catch (err) {
    if (err.response) return err;
    const error = new Error();
    error.cError = { code: 'N/A', title: 'AXIOS ERROR', detail: 'Error occured while establishing connection to the server. ' + err?.message || '' };
    throw error;
  }
};

export const get = async (path, query, token) => {
  try {
    if (!checkConnectionParams()) throw new Error();
    return await axios({
      url: protocol + '://' + host + ':' + port + '/api/v1/' + path + '/' + query,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  } catch (err) {
    if (err.response) return err;
    const error = new Error();
    error.cError = { code: 'N/A', title: 'AXIOS ERROR', detail: 'Error occured while establishing connection to the server. ' + err?.message || '' };
    throw error;
  }
};

export const post = async (path, token, reqParams) => {
  try {
    if (!checkConnectionParams()) throw new Error();
    return await axios({
      url: protocol + '://' + host + ':' + port + '/api/v1/' + path,
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: reqParams,
    });
  } catch (err) {
    if (err.response) return err;
    const error = new Error();
    error.cError = { code: 'N/A', title: 'AXIOS ERROR', detail: 'Error occured while establishing connection to the server. ' + err?.message || '' };
    throw error;
  }
};

export const patch = async (path, token, reqParams) => {
  try {
    if (!checkConnectionParams()) throw new Error();
    return await axios({
      url: protocol + '://' + host + ':' + port + '/api/v1/' + path,
      method: 'patch',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: reqParams,
    });
  } catch (err) {
    if (err.response) return err;
    const error = new Error();
    error.cError = { code: 'N/A', title: 'AXIOS ERROR', detail: 'Error occured while establishing connection to the server. ' + err?.message || '' };
    throw error;
  }
};

export const del = async (path, token) => {
  try {
    if (!checkConnectionParams()) throw new Error();
    return await axios({
      url: protocol + '://' + host + ':' + port + '/api/v1/' + path,
      method: 'delete',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  } catch (err) {
    if (err.response) return err;
    const error = new Error();
    error.cError = { code: 'N/A', title: 'AXIOS ERROR', detail: 'Error occured while establishing connection to the server. ' + err?.message || '' };
    throw error;
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

export function formatHolonObject(holon, holonStatus, holonTypes, holonPositions) {
  try {
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
    if (convertToBoolean(h.is_available) === null) h.is_available = null;
    else h.is_available = convertToBoolean(h.is_available);

    if (!h.latest_state) {
      h.latest_state = {
        status: holonStatus.na,
        type: holonTypes.na,
        position: holonPositions.na,
        parentHolon: null,
        childHolons: [],
        numberOfReadMessages: 0,
        numberOfPerceptions: 0,
      };
    } else {
      h.latest_state = JSON.parse(h.latest_state);
    }

    return h;
  } catch (err) {
    return null;
  }
}

export const formatTask = (taskTemp) => {
  try {
    if (!taskTemp) throw new Error();
    const task = JSON.parse(JSON.stringify(taskTemp));
    task.id = Number(task.id);
    task.type = task.type ? task.type.toString() : null;
    task.is_completed = convertToBoolean(task.is_completed) ? true : false;
    task.completed_on = task.completed_on ? new Date(task.completed_on) : null;
    task.name = task.name ? task.name.toString() : null;
    task.description = task.description ? task.description.toString() : null;
    task.estimated_time = isNumber(task.estimated_time) ? Number(task.estimated_time) : null;
    task.knowledge_tags = task.knowledge_tags ? JSON.parse(task.knowledge_tags) : { tags: [] };
    task.resource_demand = task.resource_demand ? JSON.parse(task.resource_demand) : { demands: [] };
    task.priority = isNumber(task.priority) ? Number(task.priority) : 0;
    task.created_on = new Date(task.created_on);
    task.created_by = isNumber(task.created_by) ? Number(task.created_by) : null;
    task.start_date = task.start_date ? new Date(task.start_date) : null;
    task.due_date = task.due_date ? new Date(task.due_date) : null;
    task.assigned_to = task.assigned_to ? JSON.parse(task.assigned_to) : { ids: [] };
    task.updated_on = task.updated_on ? new Date(task.updated_on) : null;
    return task;
  } catch (err) {
    return null;
  }
};

export function formatAllocation(allocationTemp) {
  try {
    const allocation = JSON.parse(JSON.stringify(allocationTemp));
    allocation.id = Number(allocation.id);
    allocation.request_by = Number(allocation.request_by);
    allocation.request = JSON.parse(allocation.request);
    allocation.result = allocation.result ? JSON.parse(allocation.result) : null;
    allocation.created_on = new Date(allocation.created_on);
    allocation.start_time = allocation.start_time ? new Date(allocation.start_time) : null;
    allocation.end_time = allocation.end_time ? new Date(allocation.end_time) : null;
    allocation.reallocate = convertToBoolean(allocation.reallocate);
    allocation.completed_on = allocation.completed_on ? new Date(allocation.completed_on) : null;
    allocation.updated_on = allocation.updated_on ? new Date(allocation.updated_on) : null;
    return allocation;
  } catch (err) {
    return null;
  }
}

export const isAllocationFormatValid = (allocation) => {
  try {
    const all = JSON.parse(JSON.stringify(allocation));
    const formattedAllocation = formatAllocation(all);

    if (
      typeof formattedAllocation.id === 'number' &&
      formattedAllocation.request &&
      Array.isArray(formattedAllocation.request.taskIds) &&
      Array.isArray(formattedAllocation.request.holonIds) &&
      formattedAllocation.request.taskIds.every((id) => isNumber(id)) &&
      formattedAllocation.request.holonIds.every((id) => isNumber(id))
    ) {
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
};

export function isNumber(field) {
  return !isNaN(Number(field));
}

export function isDate(param) {
  param = new Date(param);
  if (param instanceof Date && !isNaN(param)) {
    return true;
  } else return false;
}

export function generateRandomNumber() {
  return Math.random() * 1000 * 521453 * 999955;
}

export function convertToBoolean(result) {
  if (typeof result === 'string' && result === 'true') return true;
  else if (typeof result === 'string' && result === 'false') return true;
  else if (typeof result === 'boolean') return result;
  else return null;
}

/**
 * LOGGER
 */

export function log(type, message) {
  logger.createLog(type, message);
}
