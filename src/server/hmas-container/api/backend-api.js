import * as utils from '../utils/utils';

/**
 * PROPERTIES
 */

let rateLimitFlag = false;
let numberOfCalls = 0;

let token = null;
// Refresh token every 55 minutes
const refreshInterval = setInterval(async () => {
  await refreshToken();
}, 60 * 1000 * 55);
const connectionMonitorInterval = setInterval(async () => {
  if (rateLimitFlag) return;
  if (!isRestApiActive || !token) {
    token = await login();
    if (token) {
      isRestApiActive = true;
      utils.log('Status', 'HMAS Container has logged in');
    }
  }
}, 1000);

// Status
export let isRestApiActive = false;

/**
 * AUTH
 */

/**
 * Logins with app's username and password
 * Username is stored in process.env.APP_USERNAME
 * Password is stored in process.env.APP_PASSWORD
 * @returns {string} token
 */
export const login = async () => {
  try {
    const username = process.env.APP_USERNAME;
    const password = process.env.APP_PASSWORD;
    if (!username || !password) return null;
    let serverResponse = await utils.login(username, password);
    serverResponse = serverResponse.data || serverResponse.response.data;
    handleErrors(serverResponse);
    if (!serverResponse || serverResponse.errors.length > 0 || !serverResponse.data[0].attributes.token) {
      isRestApiActive = false;
      return null;
    } else {
      isRestApiActive = true;
      return serverResponse.data[0].attributes.token;
    }
  } catch (err) {
    utils.log('Error', 'Login attempt failed');
    isRestApiActive = false;
    return null;
  }
};

/**
 * Refreshes current token every 55 minutes and sets isRestApiActive as true
 */
export async function refreshToken() {
  try {
    if (!checkConnection()) throw new Error('REST API is not available');
    // If token is not available
    if (!token) token = await login();
    // If token is available
    else {
      let serverResponse = await utils.get('auth/refreshtoken', '', token);
      serverResponse = serverResponse.data || serverResponse.response.data;
      handleErrors(serverResponse.data || serverResponse.response.data);
      if (serverResponse && serverResponse.errors.length === 0 && serverResponse.data.length === 1) {
        token = serverResponse.data[0].attributes.token;
        utils.log('Success', 'Token has been refreshed');
      }
    }
    if (token) isRestApiActive = true;
  } catch (err) {
    utils.log('Error', 'Unable to refresh token');
    token = null;
    isRestApiActive = false;
  }
}

/**
 * HOLONS
 */

/**
 * Retrieves all holons from database
 * @returns standard JSON:API response
 */
export async function getAllHolons() {
  try {
    if (!checkConnection()) throw new Error('REST API is not available');
    const holonResponse = await utils.get('holons', '', token);
    handleErrors(holonResponse.data || holonResponse.response.data);
    return holonResponse.data || holonResponse.response.data;
  } catch (err) {
    if (err.message) {
      const error = new Error();
      error.cError = { detail: err.message };
      return generateErrorTemplate('Error occured while retrieving holons', error);
    } else return generateErrorTemplate('Error occured while retrieving holons', err);
  }
}

/**
 * TASKS
 */

/**
 * Retrieves all tasks from database
 * @returns standard JSON:API response
 */
export async function getAllTasks() {
  try {
    if (!checkConnection()) throw new Error('REST API is not available');
    const taskResponse = await utils.get('tasks', '', token);
    handleErrors(taskResponse.data || taskResponse.response.data);
    return taskResponse.data || taskResponse.response.data;
  } catch (err) {
    if (err.message) {
      const error = new Error();
      error.cError = { detail: err.message };
      return generateErrorTemplate('Error occured while retrieving tasks', error);
    } else return generateErrorTemplate('Error occured while retrieving tasks', err);
  }
}

/**
 * ALLOCATIONS
 */

/**
 * Retrieves all allocations from database
 * @returns standard JSON:API response
 */
export async function getAllAllocations() {
  try {
    if (!checkConnection()) throw new Error('REST API is not available');
    const allocationResponse = await utils.get('allocations', '', token);
    handleErrors(allocationResponse.data || allocationResponse.response.data);
    return allocationResponse.data || allocationResponse.response.data;
  } catch (err) {
    if (err.message) {
      const error = new Error();
      error.cError = { detail: err.message };
      return generateErrorTemplate('Error occured while retrieving allocations', error);
    } else return generateErrorTemplate('Error occured while retrieving allocations', err);
  }
}

/**
 * Sets the allocation's rellocate field as false
 * @param {number} allocationId
 * @returns standard JSON:API response
 */
export async function markAllocationHandled(allocationId) {
  try {
    if (!checkConnection()) throw new Error('REST API is not available');
    const allocationResponse = await utils.patch('allocations/' + allocationId, token, { reallocate: false });
    handleErrors(allocationResponse.data || allocationResponse.response.data);
    return allocationResponse.data || allocationResponse.response.data;
  } catch (err) {
    if (err.message) {
      const error = new Error();
      error.cError = { detail: err.message };
      return generateErrorTemplate('Error occured while retrieving holons', error);
    } else return generateErrorTemplate('Error occured while retrieving holons', err);
  }
}

/**
 * Updates allocation's start_time field
 * @param {number} allocationId
 * @returns standard JSON:API response
 */
export async function markAllocationStarted(allocationId) {
  try {
    if (!checkConnection()) throw new Error('REST API is not available');
    utils.log("Passed ", [token, isRestApiActive, rateLimitFlag].join(", "));
    const allocationResponse = await utils.patch('allocations/' + allocationId, token, { reallocate: false, start_time: new Date(), end_time: null, completed_on: null });
    handleErrors(allocationResponse.data || allocationResponse.response.data);
    return allocationResponse.data || allocationResponse.response.data;
  } catch (err) {
    if (err.message) {
      const error = new Error();
      error.cError = { detail: err.message };
      return generateErrorTemplate('Error occured while updating holon', error);
    } else return generateErrorTemplate('Error occured while updating holon', err);
  }
}

/**
 * Updates allocation's result field
 * @param {object} result
 * @returns standard JSON:API response
 */
export async function updateAllocationResult(allocationId, result) {
  try {
    if (!checkConnection()) throw new Error('REST API is not available');
    const allocationResponse = await utils.patch('allocations/' + allocationId, token, { result: result, end_time: new Date() });
    handleErrors(allocationResponse.data || allocationResponse.response.data);
    return allocationResponse.data || allocationResponse.response.data;
  } catch (err) {
    if (err.message) {
      const error = new Error();
      error.cError = { detail: err.message };
      return generateErrorTemplate('Error occured while updating holon', error);
    } else return generateErrorTemplate('Error occured while updating holon', err);
  }
}

/**
 * ALGORITHMS
 */

/**
 * Registers algorithms to database
 * @param {array} algorithms elements are objects with properties: name, type, description and run
 * @returns standard JSON:API response
 */
export async function registerAlgorithms(algorithms) {
  try {
    if (!checkConnection()) throw new Error('REST API is not available');
    // Get algorithms
    const algRes = await utils.get('algorithms', '', token);
    const algorithmIds = algRes.data.data.map((alg) => Number(alg.attributes.id));

    // Delete algorithms
    const deletedAlgorithms = [];
    let algorithmDeleteResponse = false;
    for (let i = 0; i < algorithmIds.length; i++) {
      const id = algorithmIds[i];
      let res = await utils.del('algorithms/' + id, token);
      res = res.data || res.response.data;
      if (res.errors.length === 0 && utils.isNumber(res.data[0].attributes.id)) deletedAlgorithms.push(Number(res.data[0].attributes.id));
      else if (res.errors.length > 0) throw new Error('Unable to delete algorithms');
    }
    algorithmDeleteResponse = deletedAlgorithms.every((id) => algorithmIds.includes(id));

    // Register algorithms
    const registeredAlgorithmNames = [];
    let algorithmCreationResponse = false;
    for (let i = 0; i < algorithms.length; i++) {
      const alg = algorithms[i];
      let res = await utils.post('algorithms', token, { type: alg.type, name: alg.name, description: alg.description });
      res = res.data || res.response.data;
      if (res.errors.length === 0 && utils.isNumber(res.data[0].attributes.id)) registeredAlgorithmNames.push(res.data[0].attributes.name);
      else if (res.errors.length > 0) throw new Error('Unable to register algorithms');
    }
    algorithmCreationResponse = registeredAlgorithmNames.every((name) => algorithms.map((alg) => alg.name).includes(name));

    if (algorithmDeleteResponse && algorithmCreationResponse) {
      let serverResponse = await utils.get('algorithms', '', token);
      return serverResponse.data || serverResponse.response.data;
    } else throw new Error('Failed to register algorithms');
  } catch (err) {
    if (err.message) {
      const error = new Error();
      error.cError = { detail: err.message };
      return generateErrorTemplate('Error occured while retrieving allocations', error);
    } else return generateErrorTemplate('Error occured while retrieving allocations', err);
  }
}

/**
 * UTILITY FUNCTIONS
 */

async function checkConnection() {
  if(numberOfCalls % 50 === 0) utils.log("Status", "Backend API - API has made totally "+numberOfCalls++ +" calls to REST API");
  if (!token || !isRestApiActive) {
    utils.log('Status', "Backend API - is down");
    isRestApiActive = false;
    token = null;
    return false;
  } else {
    return true;
  }
}

/**
 * JSON API Error message handler
 * @param {JSON:API} response
 */
function handleErrors(response) {
  if (!response || !response.errors || response.errors.length === 0) return;
  utils.log('API ERROR RESPONSE', response.errors[0].detail);

  // Error 401
  if (response.errors[0].status === 401) {
    isRestApiActive = false;
    token = null;
  } else if (response.errors[0].status === 429) {
    utils.log('Status', "Backend API - Rate limit achieved. API is going to sleep.");
    rateLimitFlag = true;
    isRestApiActive = false;
    token = null;
    setTimeout(() => {
      rateLimitFlag = false;
    }, 60000);
  }
}

function generateErrorTemplate(title, errorObject) {
  return {
    links: null,
    data: [],
    errors: [
      {
        code: 'N/A',
        title: title,
        detail: errorObject.cError?.detail,
      },
    ],
  };
}

export const stop = () => {
  clearInterval(refreshInterval);
  clearInterval(connectionMonitorInterval);
  utils.log('Status', 'Backend API - stopped');
};
