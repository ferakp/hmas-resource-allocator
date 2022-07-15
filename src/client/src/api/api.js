import * as utils from '../utils/utils';

/**
 * PROPERTIES
 *
 *
 *
 *
 */
export let isRestApiActive = false;
export let dispatch = null;

export function setDispatch(f) {
  dispatch = f;
}

/**
 * AUTH
 *
 *
 *
 *
 */

let token = null;
// Refresh token every 55 minutes
const refreshInterval = setInterval(async () => {
  await refreshToken();
}, 1000 * 60 * 55);

/**
 * Logins with username and password
 * @returns {object} standard JSON:API response
 */
export async function login(username, password) {
  const loginResponse = await utils.login(username, password);
  const response = loginResponse.data || loginResponse.response.data;
  if (response.errors.length === 0) {
    token = response.data[0].attributes.token;
    this.dispatch({ type: 'REFRESHTOKEN', payload: { token: token } });
    isRestApiActive = true;
    return response;
  }
  this.dispatch({ type: 'LOGOUT' });
  isRestApiActive = false;
  return response;
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
      isRestApiActive = true;
      this.dispatch({ type: 'REFRESHTOKEN', payload: { token: token } });
    }
  } catch (err) {
    token = null;
    if (this.dispatch) this.dispatch({ type: 'LOGOUT' });
    isRestApiActive = false;
  }
}

/**
 * USERS
 *
 *
 *
 *
 */

/**
 * Retrieves users from database
 * @returns standard JSON:API response
 */
export async function getAllUsers() {
  try {
    checkConnection();
    const userResponse = await utils.get('users', '', token);
    return userResponse.data || userResponse.response.data;
  } catch (err) {
    // err has cError property which contains actual error
    return generateErrorTemplate('Error occured while retrieving users', err);
  }
}

/**
 * Retrieves user with given query
 * @returns standard JSON:API response
 */
export async function getUsers(query) {
  try {
    checkConnection();
    const userResponse = await utils.get('users', query, token);
    return userResponse.data || userResponse.response.data;
  } catch (err) {
    // err has cError property which contains actual error
    return generateErrorTemplate('Error occured while retrieving users', err);
  }
}

/**
 * Update user
 * @returns standard JSON:API response
 */
export async function updateUser(userId, params) {
  try {
    checkConnection();
    const userResponse = await utils.post('users/' + userId, token, params);
    return userResponse.data || userResponse.response.data;
  } catch (err) {
    // err has cError property which contains actual error
    return generateErrorTemplate('Error occured while updating user', err);
  }
}

/**
 * Delete user
 * @returns standard JSON:API response
 */
export async function deleteUser(userId) {
  try {
    checkConnection();
    const userResponse = await utils.del('users/' + userId, token);
    return userResponse.data || userResponse.response.data;
  } catch (err) {
    // err has cError property which contains actual error
    return generateErrorTemplate('Error occured while updating user', err);
  }
}

/**
 * HOLONS
 *
 *
 *
 *
 */

/**
 * Retrieves all holons from database
 * @returns standard JSON:API response
 */
export async function getAllHolons() {
  try {
    checkConnection();
    const holonResponse = await utils.get('holons', '', token);
    return holonResponse.data || holonResponse.response.data;
  } catch (err) {
    // err has cError property which contains actual error
    return generateErrorTemplate('Error occured while retrieving holons', err);
  }
}

/**
 * Makes bulk-update-check for given IDs
 * @param {array} holonIds array of IDs
 * @returns standard JSON:API response
 */
export async function getHolonUpdates(holonIds) {
  try {
    checkConnection();
    const holonResponse = await utils.post('search', token, { type: 'bulk-update-check', resource: 'holons', ids: holonIds });
    return holonResponse.data || holonResponse.response.data;
  } catch (err) {
    // err has cError property which contains actual error
    return generateErrorTemplate('Error occured while checking for updated holons', err);
  }
}

/**
 * Updates holon
 * @param {object} fields
 * @returns standard JSON:API response
 */
export async function updateHolon(holonId, fields) {
  try {
    checkConnection();
    const holonResponse = await utils.patch('holons/' + holonId, token, fields);
    return holonResponse.data || holonResponse.response.data;
  } catch (err) {
    return generateErrorTemplate('Error occured while updating holon', err);
  }
}

/**
 * TASKS
 *
 *
 *
 *
 */

/**
 * Retrieves all tasks from database
 * @returns standard JSON:API response
 */
export async function getAllTasks() {
  try {
    checkConnection();
    const holonResponse = await utils.get('tasks', '', token);
    return holonResponse.data || holonResponse.response.data;
  } catch (err) {
    return generateErrorTemplate('Error occured while retrieving tasks', err);
  }
}

/**
 * Makes bulk-update-check for given IDs
 * @param {array} taskIds
 * @returns standard JSON:API response
 */
export async function getTaskUpdates(taskIds) {
  try {
    checkConnection();
    const taskResponse = await utils.post('search', token, { type: 'bulk-update-check', resource: 'tasks', ids: taskIds });
    return taskResponse.data || taskResponse.response.data;
  } catch (err) {
    return generateErrorTemplate('Error occured while checking for updated tasks', err);
  }
}

/**
 * ALLOCATIONS
 *
 *
 *
 *
 */

/**
 * Retrieves all allocations from database
 * @returns standard JSON:API response
 */
export async function getAllAllocations() {
  try {
    checkConnection();
    const allocationResponse = await utils.get('allocations', '', token);
    return allocationResponse.data || allocationResponse.response.data;
  } catch (err) {
    return generateErrorTemplate('Error occured while retrieving allocations', err);
  }
}

/**
 * Makes bulk-update-check for given IDs
 * @param {array} allocationIds
 * @returns standard JSON:API response
 */
export async function getAllocationUpdates(allocationIds) {
  try {
    checkConnection();
    const allocationResponse = await utils.post('search', token, { type: 'bulk-update-check', resource: 'allocations', ids: allocationIds });
    return allocationResponse.data || allocationResponse.response.data;
  } catch (err) {
    return generateErrorTemplate('Error occured while checking for updated allocations', err);
  }
}

/**
 * UTILITIES
 *
 *
 */

function checkConnection() {
  const error = new Error('SERVER IS DOWN');
  error.cError = {
    code: 'N/A',
    title: 'SERVER IS DOWN',
    detail: 'The network connection to the server is broken or temporarily down.',
  };

  if (!isRestApiActive) throw error;
  else return true;
}

function generateErrorTemplate(title, errorObject) {
  return {
    links: null,
    data: [],
    errors: [
      {
        code: 'N/A',
        title: title,
        detail: errorObject.cError.detail,
      },
    ],
  };
}
