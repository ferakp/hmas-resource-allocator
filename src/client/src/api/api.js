import * as utils from '../utils/utils';
import * as logger from '../logger/logger';

/**
 * PROPERTIES
 *
 *
 *
 *
 */
export let isRestApiActive = false;
export let dispatch = null;

/**
 * UPDATE
 */

let lastDataUpdateTime = new Date();
let dataUpdateInterval = null;

const activateApi = () => {
  isRestApiActive = true;
  if (dataUpdateInterval) clearInterval(dataUpdateInterval);
  updateData();
  dataUpdateInterval = setInterval(async () => {
    await updateData();
  }, 5000);
};

const deActivateApi = utils.debounce(() => {
  isRestApiActive = false;
  if (dataUpdateInterval) clearInterval(dataUpdateInterval);
  if (dispatch) dispatch({ type: 'LOGOUT' });
});

export function setDispatch(f) {
  dispatch = f;
}

async function updateData() {
  if (!isRestApiActive) return;
  const data = {};
  try {
    const algorithmsResponse = await getAllAlgorithms();
    const allocationsResponse = await getAllAllocations();
    const holonsResponse = await getAllHolons();
    const settingsResponse = await getAllSettings();
    const tasksResponse = await getAllTasks();
    const usersResponse = await getAllUsers();

    if (algorithmsResponse)
      if (algorithmsResponse.errors.length === 0) data.algorithms = algorithmsResponse.data.map((alg) => alg.attributes);
      else handleErrorResponse(algorithmsResponse);
    if (allocationsResponse)
      if (allocationsResponse.errors.length === 0) data.allocations = allocationsResponse.data.map((al) => al.attributes);
      else handleErrorResponse(allocationsResponse);
    if (holonsResponse)
      if (holonsResponse.errors.length === 0) data.holons = holonsResponse.data.map((hol) => hol.attributes);
      else handleErrorResponse(holonsResponse);
    if (settingsResponse)
      if (settingsResponse.errors.length === 0) data.settings = settingsResponse.data.map((set) => set.attributes);
      else handleErrorResponse(settingsResponse);
    if (tasksResponse)
      if (tasksResponse.errors.length === 0) data.tasks = tasksResponse.data.map((task) => task.attributes);
      else handleErrorResponse(tasksResponse);
    if (usersResponse)
      if (usersResponse.errors.length === 0) data.users = usersResponse.data.map((users) => users.attributes);
      else handleErrorResponse(usersResponse);

    if (dispatch) {
      dispatch({ type: 'DATA_UPDATED', payload: { data } });
      logger.log('Success', 'Data have been retrieved');
    } else {
      logger.log('Error', 'Data have been retrieved but no dispatch is available');
    }
  } catch (err) {
    logger.log('Error', 'Failed to update data');
  }
}

/**
 * ERROR HANDLER
 *
 *
 *
 *
 */

/**
 * JSON API Error message handler
 * @param {JSON:API} response
 */
function handleErrorResponse(response) {
  if (response.errors?.length === 0) return;
  logger.log('API ERROR RESPONSE', response.errors[0].detail);

  // Error 401
  if (response.errors[0].status === 401) {
    deActivateApi();
  }
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
  try {
    const loginResponse = await utils.login(username, password);
    const response = loginResponse.data || loginResponse.response.data;
    if (response.errors.length === 0) {
      token = response.data[0].attributes.token;
      if (dispatch) dispatch({ type: 'REFRESHTOKEN', payload: { token: token } });
      activateApi();
      return response;
    } else {
      handleErrorResponse(response);
      deActivateApi();
      return response;
    }
  } catch (err) {
    logger.log('Error', 'Unknown error occured while sending login request');
    deActivateApi();
  }
}

/**
 * Refreshes current token every 55 minutes and sets isRestApiActive as true
 */
export async function refreshToken() {
  try {
    checkConnection();
    const callResponse = await utils.get('refreshtoken', '', token);
    const response = callResponse.data || callResponse.response.data;
    if (response.errors.length > 0) {
      deActivateApi();
      handleErrorResponse(response);
      return;
    } else {
      token = callResponse.data.data[0].attributes.token;
      activateApi();
      if (dispatch) {
        dispatch({ type: 'REFRESHTOKEN', payload: { token: token } });
        logger.log('Success', 'Token has been refreshed');
      } else {
        logger.log('Error', 'Token has been refreshed but dispatch is not available');
      }
    }
  } catch (err) {
    logger.log('Error', 'Error occured while refreshing token');
  }
}

/**
 * SETTINGS
 *
 *
 *
 *
 */

/**
 * Retrieves settings from database
 * @returns standard JSON:API response
 */
export async function getAllSettings() {
  try {
    checkConnection();
    const userResponse = await utils.get('settings', '', token);
    handleErrorResponse(userResponse.data || userResponse.response.data);
    return userResponse.data || userResponse.response.data;
  } catch (err) {
    // err has cError property which contains actual error
    return generateErrorTemplate('Error occured while retrieving settings', err);
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
    handleErrorResponse(userResponse.data || userResponse.response.data);
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
    handleErrorResponse(userResponse.data || userResponse.response.data);
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
    handleErrorResponse(userResponse.data || userResponse.response.data);
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
    handleErrorResponse(userResponse.data || userResponse.response.data);
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
    handleErrorResponse(holonResponse.data || holonResponse.response.data);
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
    handleErrorResponse(holonResponse.data || holonResponse.response.data);
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
    handleErrorResponse(holonResponse.data || holonResponse.response.data);
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
    const taskResponse = await utils.get('tasks', '', token);
    handleErrorResponse(taskResponse.data || taskResponse.response.data);
    return taskResponse.data || taskResponse.response.data;
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
    handleErrorResponse(taskResponse.data || taskResponse.response.data);
    return taskResponse.data || taskResponse.response.data;
  } catch (err) {
    return generateErrorTemplate('Error occured while checking for updated tasks', err);
  }
}

/**
 * Marks task as completed
 * @param {Number} taskId
 * @returns standard JSON:API response
 */
export async function markTaskCompleted(taskId) {
  try {
    checkConnection();
    const taskResponse = await utils.patch('tasks/' + taskId, token, { is_completed: true });
    handleErrorResponse(taskResponse.data || taskResponse.response.data);
    return taskResponse.data || taskResponse.response.data;
  } catch (err) {
    return generateErrorTemplate('Error occured while marking task as completed', err);
  }
}

/**
 * Marks task as uncompleted
 * @param {Number} taskId
 * @returns standard JSON:API response
 */
export async function markTaskUncompleted(taskId) {
  try {
    checkConnection();
    const taskResponse = await utils.patch('tasks/' + taskId, token, { is_completed: false });
    handleErrorResponse(taskResponse.data || taskResponse.response.data);
    return taskResponse.data || taskResponse.response.data;
  } catch (err) {
    return generateErrorTemplate('Error occured while marking task as uncompleted', err);
  }
}

/**
 * Updates task with given parameters
 * @param {object} params task fields to be updated
 * @returns standard JSON:API response
 */
export async function updateTask(taskId, params) {
  try {
    checkConnection();
    const taskResponse = await utils.patch('tasks/' + taskId, token, params);
    handleErrorResponse(taskResponse.data || taskResponse.response.data);
    return taskResponse.data || taskResponse.response.data;
  } catch (err) {
    return generateErrorTemplate('Error occured while updating the task', err);
  }
}

/**
 * Delete the task with given id
 * @param {number} taskId task ID
 * @returns standard JSON:API response
 */
export async function deleteTask(taskId) {
  try {
    checkConnection();
    const taskResponse = await utils.del('tasks/' + taskId, token);
    handleErrorResponse(taskResponse.data || taskResponse.response.data);
    return taskResponse.data || taskResponse.response.data;
  } catch (err) {
    return generateErrorTemplate('Error occured while deleting the task', err);
  }
}

/**
 * Add task with given parameters
 * @param {object} parameters new task details
 * @returns standard JSON:API response
 */
export async function addTask(params) {
  try {
    checkConnection();
    const taskResponse = await utils.post('tasks/', token, params);
    handleErrorResponse(taskResponse.data || taskResponse.response.data);
    return taskResponse.data || taskResponse.response.data;
  } catch (err) {
    return generateErrorTemplate('Error occured while deleting the task', err);
  }
}

/**
 * ALGORITHMS
 *
 *
 *
 *
 */

/**
 * Retrieves all algorihtms from database
 * @returns standard JSON:API response
 */
export async function getAllAlgorithms() {
  try {
    checkConnection();
    const algorithmResponse = await utils.get('algorithms', '', token);
    handleErrorResponse(algorithmResponse.data || algorithmResponse.response.data);
    return algorithmResponse.data || algorithmResponse.response.data;
  } catch (err) {
    return generateErrorTemplate('Error occured while retrieving algorithms', err);
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
    handleErrorResponse(allocationResponse.data || allocationResponse.response.data);
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
    handleErrorResponse(allocationResponse.data || allocationResponse.response.data);
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
  if (!token) {
    deActivateApi();
  }
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
