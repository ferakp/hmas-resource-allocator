import * as utils from '../utils/utils';

/**
 * PROPERTIES
 */

let token = null;
// Refresh token every 55 minutes
const refreshInterval = setInterval(async () => {
  await refreshToken();
}, 1000 * 60 * 55);

// Status
export const isRestApiActive = false;


/**
 * AUTH
 */

/**
 * Logins with app's username and password
 * Username is stored in process.env.APP_USERNAME
 * Password is stored in process.env.APP_PASSWORD
 * @returns {string} token
 */
export async function login() {
  const username = process.env.APP_USERNAME;
  const password = process.env.APP_PASSWORD;

  const loginResponse = await utils.login(username, password);
  if (!loginResponse.data.data[0].attributes.token) throw new Error();
  else return loginResponse.data.data[0].attributes.token;
}

/**
 * Refreshes current token every 55 minutes and sets isRestApiActive as true
 */
export async function refreshToken() {
  try {
    // If token is available
    if (token) {
      const callResponse = await utils.get('refreshtoken', '', token);
      token = callResponse.data.data[0].attributes.token;
    }

    // If token is not available
    if (!token) {
      token = await login();
    }

    isRestApiActive = true;
  } catch (err) {
    token = null;
    isRestApiActive = false;
  }
}

/**
 * HOLONS
 */

/**
 * Retrieves all holons from database
 * @returns array of holons
 */
export async function getAllHolons() {
  try {
    const response = [];
    const holonResponse = await utils.get('holons', '', token);
    holonResponse.data.data.forEach((d) => response.push(d.attributes));
    return response;
  } catch (err) {
    return [];
  }
}

/**
 * Update given IDs
 * @param {array} holonIds array of IDs
 * @returns object with properties updatedResources and deletedIds
 */
export async function updateHolons(holonIds) {
  try {
    const response = [];
    const holonResponse = await utils.post('search', token, { type: 'bulk-update-check', resource: 'holons', ids: holonIds });
    return holonResponse.data.data[0].attributes;
  } catch (err) {
    return { updatedResources: [], deletedIds: [] };
  }
}

/**
 * Updates holon's latest_state field
 * @param {object} holonState
 * @returns resource object or null
 */
export async function updateHolonState(holonState) {
  try {
    const holonResponse = await utils.patch('holons', token, { latest_state: JSON.stringify(holonState) });
    const response = holonResponse.data.data[0].attributes;
    return response;
  } catch (err) {
    return null;
  }
}

/**
 * TASKS
 */

/**
 * Retrieves all tasks from database
 * @returns array of tasks
 */
export async function getAllTasks() {
  try {
    const response = [];
    const taskResponse = await utils.get('tasks', '', token);
    taskResponse.data.data.forEach((d) => response.push(d.attributes));
    return response;
  } catch (err) {
    return [];
  }
}

/**
 * Update given IDs
 * @param {array} taskIds
 * @returns array of tasks
 */
export async function updateTasks(taskIds) {
  try {
    const response = [];
    const taskResponse = await utils.post('search', token, { type: 'bulk-update-check', resource: 'tasks', ids: taskIds });
    return taskResponse.data.data[0].attributes;
  } catch (err) {
    return { updatedResources: [], deletedIds: [] };
  }
}

/**
 * ALLOCATIONS
 */

/**
 * Retrieves all allocations from database
 * @returns array of allocations
 */
export async function getAllAllocations() {
  try {
    const response = [];
    const allocationResponse = await utils.get('allocations', '', token);
    allocationResponse.data.data.forEach((d) => response.push(d.attributes));
    return response;
  } catch (err) {
    return [];
  }
}

/**
 * Update given IDs
 * @param {array} allocationIds
 * @returns array of allocations
 */
export async function updateAllocations(allocationIds) {
  try {
    const response = [];
    const allocationResponse = await utils.post('search', token, { type: 'bulk-update-check', resource: 'allocations', ids: allocationIds });
    return allocationResponse.data.data[0].attributes;
  } catch (err) {
    return { updatedResources: [], deletedIds: [] };
  }
}

/**
 * Updates allocation's rellocate field as false
 * @param {number} allocationId
 * @returns null (failed) or updated allocation (success)
 */
export async function markAllocationHandled(allocationId) {
  try {
    const response = await utils.post('allocations/' + allocationId, token, { reallocate: false });
    return response.data.data[0].attributes;
  } catch (err) {
    return null;
  }
}

/**
 * Updates allocation's result field
 * @param {object} result
 * @returns null (failed) or updated allocation (success)
 */
export async function updateAllocationResult(result) {
  try {
    const response = await utils.post('allocations/' + allocationId, token, { result: JSON.stringify(result) });
    return response.data.data[0].attributes;
  } catch (err) {
    return null;
  }
}
