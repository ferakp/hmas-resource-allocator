const axios = require('axios').default;

let host = null;
let port = null;
let protocol = 'http';

const configInterval = setInterval(() => {
  if (process.env.HOST && process.env.PORT && process.env.NODE_ENV) {
    host = process.env.HOST;
    port = process.env.PORT;
    protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    clearInterval(configInterval);
  }
}, 500);

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

const checkConnectionParams = () => {
  if (!host || !port) return false;
  else return true;
};

/**
 * Waits s seconds
 * @param {number} s seconds
 * @returns Promise
 */
export const wait = async (s) => {
  return new Promise((r, e) => setTimeout(r, s * 1000));
};

export const stop = () => {
  clearInterval(configInterval);
};

/**
 * Switches the host and port address of calls
 * @returns boolean
 */
export const switchRestApiToBackend = () => {
  // Assure the config interval is not running
  clearInterval(configInterval);
  host = process.env.REST_API_HOST;
  port = process.env.REST_API_PORT;
  protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  if (!host || !port) return false;
  return true;
};

/**
 *
 * GENERATORS
 *
 *
 *
 */

export const generateRandomNumber = () => {
  return Math.floor(Math.random() * 54225 * 10225 * 10000000 * Math.random());
};

export const generateRandomString = () => {
  return Buffer.from(Math.random().toString()).toString('base64').slice(0, 5) + generateRandomNumber();
};

export const generateRandomDataField = () => {
  return JSON.stringify({
    currentValue: Math.random(),
    records: [],
    latestUpdate: new Date(),
  });
};

export const generateHolon = () => {
  const holon = {};
  holon.type = generateRandomString();
  holon.name = generateRandomString();
  holon.gender = generateRandomString();
  holon.daily_work_hours = 6;
  holon.availability_data = generateRandomDataField();
  holon.load_data = generateRandomDataField();
  holon.stress_data = generateRandomDataField();
  holon.cost_data = JSON.stringify({
    currentValue: (JSON.parse(holon.load_data).currentValue + JSON.parse(holon.stress_data).currentValue) / 2,
    records: [],
    latestUpdate: new Date(),
  });
  holon.age = Math.floor(17 + (Math.random() * 50));
  holon.experience_years = Math.floor(Math.random() * 29);
  holon.is_available = true;
  return holon;
};

export const generateRandomKnowledgeTags = () => {
  const knowledgeTags = ['sql', 'mysql', 'javascript', 'java', 'c#', 'typescript', 'html', 'css', 'python', 'sketching', 'documentation'];
  const selectedTags = [];

  for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
    const randomTagIndex = Math.floor(Math.random() * 10.45);
    if (!selectedTags.includes(knowledgeTags[randomTagIndex])) selectedTags.push(knowledgeTags[randomTagIndex]);
  }

  return JSON.stringify({ tags: selectedTags });
};

export const generateRandomResourceDemand = () => {
  const demands = [];
  for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
    const randomKnowledgeTags = JSON.parse(generateRandomKnowledgeTags()).tags;
    const randomType = generateRandomString();
    const randomExperienceYears = Math.floor(Math.random() * 29);
    demands.push([randomType, randomExperienceYears, randomKnowledgeTags]);
  }
  return JSON.stringify({ demands });
};

export const generateRandomDueDate = () => {
  let date = new Date();
  date = new Date(date.getTime() + 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 120));
  return Math.random() < 0.5 ? date : null;
};

export const generateTask = () => {
  const task = {};
  task.type = generateRandomString();
  task.name = generateRandomString();
  task.description = generateRandomString();
  task.estimated_time = Math.random() * 1000;
  task.knowledge_tags = generateRandomKnowledgeTags();
  task.resource_demand = generateRandomResourceDemand();
  task.priority = Math.floor(Math.random() * 5.45);
  task.start_date = new Date();
  task.due_date = generateRandomDueDate();
  return task;
};
