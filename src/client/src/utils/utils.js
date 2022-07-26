const axios = require('axios').default;

/**
 * FUNCTIONS FOR STATE MODULE
 */

let updateInProgress = false;

export function updateData(state, data) {
  if (updateInProgress) return;
  updateInProgress = true;
  try {
    formatData(data);
    if (Array.isArray(data.algorithms)) state.data.algorithms = data.algorithms;
    if (Array.isArray(data.allocations)) state.data.allocations = data.allocations;
    if (Array.isArray(data.holons)) state.data.holons = data.holons;
    if (Array.isArray(data.settings)) state.data.settings = data.settings;
    if (Array.isArray(data.tasks)) state.data.tasks = data.tasks;
    if (Array.isArray(data.users)) state.data.users = data.users;
    updateInProgress = false;
  } catch (err) {
    updateInProgress = false;
  }
}

export const debounceUpdateData = debounce((state, data) => updateData(state, data));

export function debounce(func) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, 100);
  };
}

export function debounceLong(func) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, 500);
  };
}

/**
 * Formats data retrieved from database
 * @param {object} data could have following properties: algorithms, allocations, holons, settings, tasks, users
 */
function formatData(data) {
  let invalidElements = [];

  if (Array.isArray(data.algorithms)) {
    data.algorithms.forEach((algorithm, i) => {
      try {
        algorithm.id = Number(algorithm.id);
        algorithm.type = algorithm.type ? algorithm.type.toString() : null;
        algorithm.name = algorithm.name ? algorithm.name.toString() : null;
        algorithm.description = algorithm.description ? algorithm.description.toString() : null;
        algorithm.created_on = new Date(algorithm.created_on);
        algorithm.updated_on = new Date(algorithm.updated_on);
        algorithm.created_by = Number(algorithm.created_by);
      } catch (err) {
        invalidElements.push(i);
      }
    });

    if (invalidElements.length > 0) {
      invalidElements.forEach((i) => {
        data.algorithms.splice(i);
      });
      invalidElements = [];
    }
  }

  if (Array.isArray(data.allocations)) {
    data.allocations.forEach((allocation, i) => {
      try {
        allocation.id = Number(allocation.id);
        allocation.request_by = Number(allocation.request_by);
        allocation.request = JSON.parse(allocation.request);
        allocation.result = allocation.result ? JSON.parse(allocation.request) : null;
        allocation.created_on = new Date(allocation.created_on);
        allocation.start_time = allocation.start_time ? new Date(allocation.start_time) : null;
        allocation.end_time = allocation.end_time ? new Date(allocation.end_time) : null;
        allocation.reallocate = Boolean(allocation.reallocate);
        allocation.updated_on = new Date(allocation.updated_on);
        allocation.completed_on = allocation.completed_on ? new Date(allocation.completed_on) : null;
      } catch (err) {
        invalidElements.push(i);
      }
    });

    if (invalidElements.length > 0) {
      invalidElements.forEach((i) => {
        data.allocations.splice(i);
      });
      invalidElements = [];
    }
  }

  if (Array.isArray(data.holons)) {
    data.holons.forEach((holon, i) => {
      try {
        holon.id = Number(holon.id);
        holon.type = holon.type.toString();
        holon.name = holon.name.toString();
        holon.gender = holon.gender ? holon.gender.toString() : null;
        holon.daily_work_hours = Number(holon.daily_work_hours);
        holon.latest_state = holon.latest_state ? JSON.parse(holon.latest_state) : {};
        holon.remote_address = holon.remote_address ? holon.remote_address : null;
        holon.api_token = holon.api_token ? holon.api_token : null;
        holon.availability_data = holon.availability_data ? JSON.parse(holon.availability_data) : { currentValue: 0, latestUpdate: new Date(), records: [] };
        holon.cost_data = holon.cost_data ? JSON.parse(holon.cost_data) : { currentValue: 0, latestUpdate: new Date(), records: [] };
        holon.load_data = holon.load_data ? JSON.parse(holon.load_data) : { currentValue: 0, latestUpdate: new Date(), records: [] };
        holon.stress_data = holon.stress_data ? JSON.parse(holon.stress_data) : { currentValue: 0, latestUpdate: new Date(), records: [] };
        holon.age = isNumber(holon.age) ? Number(holon.age) : null;
        holon.experience_years = isNumber(holon.experience_years) ? Number(holon.experience_years) : null;
        holon.created_on = new Date(holon.created_on);
        holon.created_by = Number(holon.created_by);
        holon.updated_on = new Date(holon.updated_on);
      } catch (err) {
        invalidElements.push(i);
      }
    });

    if (invalidElements.length > 0) {
      invalidElements.forEach((i) => {
        data.holons.splice(i);
      });
      invalidElements = [];
    }
  }

  if (Array.isArray(data.settings)) {
    data.settings.forEach((settings, i) => {
      try {
        settings.id = Number(settings.id);
        settings.settings = JSON.parse(settings.settings);
        settings.created_on = new Date(settings.created_on);
        settings.updated_on = new Date(settings.updated_on);
        settings.created_by = Number(settings.created_by);
      } catch (err) {
        invalidElements.push(i);
      }
    });

    if (invalidElements.length > 0) {
      invalidElements.forEach((i) => {
        data.settings.splice(i);
      });
      invalidElements = [];
    }
  }

  if (Array.isArray(data.tasks)) {
    data.tasks.forEach((task, i) => {
      try {
        task = formatTask(task);
      } catch (err) {
        invalidElements.push(i);
      }
    });

    if (invalidElements.length > 0) {
      invalidElements.forEach((i) => {
        data.tasks.splice(i);
      });
      invalidElements = [];
    }
  }

  if (Array.isArray(data.users)) {
    data.users.forEach((user, i) => {
      try {
        user.id = Number(user.id);
        user.role = user.role ? user.role.toString() : null;
        user.username = user.username ? user.username.toString() : null;
        user.password = user.password ? user.password.toString() : null;
        user.firstname = user.firstname ? user.firstname.toString() : null;
        user.lastname = user.lastname ? user.lastname.toString() : null;
        user.email = user.email ? user.email.toString() : null;
        user.created_on = user.created_on ? new Date(user.created_on) : null;
        user.last_login = user.last_login ? new Date(user.last_login) : null;
        user.updated_on = user.updated_on ? new Date(user.updated_on) : null;
      } catch (err) {
        invalidElements.push(i);
      }
    });

    if (invalidElements.length > 0) {
      invalidElements.forEach((i) => {
        data.users.splice(i);
      });
      invalidElements = [];
    }
  }
}

export function formatTask(task) {
  try {
    task.id = Number(task.id);
    task.type = task.type ? task.type.toString() : null;
    task.is_completed = Boolean(task.is_completed);
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
    return task;
  }
}

/**
 * Inserts updated task into the state
 * @param {object} state state of the app
 * @param {object} task task object
 * @returns boolean
 */
export const updateTask = debounce((state, task) => {
  try {
    const formattedTask = formatTask(task);
    for (let i = 0; i < state.data.tasks.length; i++) {
      if (state.data.tasks[i].id === formattedTask.id) {
        state.data.tasks[i] = formattedTask;
        return true;
      }
    }
  } catch (err) {
    return false;
  }
});

/**
 * Deletes the task with given id from the state data
 * @param {number} id task ID
 * @returns boolean
 */
export const deleteTask = debounce((state, id) => {
  try {
    for (let i = 0; i < state.data.tasks.length; i++) {
      if (state.data.tasks[i].id === id) {
        state.data.tasks.splice(i, 1);
        return true;
      }
    }
  } catch (err) {
    return false;
  }
});

/**
 * Add a new task
 * @param {object} task new task
 * @returns boolean
 */
export const addTask = debounce((state, task) => {
  try {
    console.log("Add task called");
    const formattedTask = formatTask(task);
    state.data.tasks.push(formattedTask);
    return true;
  } catch (err) {
    return false;
  }
});

/**
 * Checks if resource exists and then updates or inserts into the array
 * @param {array} array array of resources that have id property
 * @param {object} resource resource object
 **/
function updateResource(array, resource) {
  if (!Array.isArray(array)) array = [];
  let updated = false;

  for (let i = 0; i < array.length; i++) {
    if (array[i].id === resource.id) {
      Object.keys(array[i]).forEach((key) => {
        array[i][key] = resource[key];
      });
      updated = true;
      break;
    }
  }

  if (!updated) array.push(resource);
}

export function isNumber(param) {
  if (param !== null && param !== undefined && !isNaN(param)) return true;
  else return false;
}

/**
 * ORDER
 */

/**
 * Orders array elements
 * @param {array} array element have the property 'fieldName'
 * @param {string} fieldName the name of field to be used for comparison
 * @param {boolean} isAscendant order of list
 * @returns
 */
export function orderArrayElements(array, fieldName, isAscendant) {
  const newArray = [];
  try {
    array.forEach((element) => {
      if (newArray.length === 0) newArray.push(element);
      else {
        for (let i = 0; i < newArray.length; i++) {
          if (element[fieldName] < newArray[i][fieldName]) {
            newArray.splice(i, 0, element);
            break;
          }
          if (i === newArray.length - 1) {
            newArray.push(element);
            break;
          }
        }
      }
    });
    if (isAscendant) return newArray;
    else {
      return newArray.reverse();
    }
  } catch (err) {
    return array;
  }
}

/**
 * AJAX CALLS
 */

const host = 'localhost';
const port = 5000;

export const login = async (username, password) => {
  try {
    return await axios({
      url: 'http://' + host + ':' + port + '/api/v1/auth/login',
      method: 'get',
      headers: {
        Authorization: 'Basic ' + window.btoa(username + ':' + password),
      },
    });
  } catch (err) {
    if (err.response) return err;
    const error = new Error();
    error.cError = { code: 'N/A', title: 'AXIOS ERROR', detail: 'Error occured while establishing connection to the server' };
    throw error;
  }
};

export const get = async (path, query, token) => {
  try {
    return await axios({
      url: 'http://' + host + ':' + port + '/api/v1/' + path + '/' + query,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  } catch (err) {
    if (err.response) return err;
    const error = new Error();
    error.cError = { code: 'N/A', title: 'AXIOS ERROR', detail: 'Error occured while establishing connection to the server' };
    throw error;
  }
};

export const post = async (path, token, reqParams) => {
  try {
    return await axios({
      url: 'http://' + host + ':' + port + '/api/v1/' + path,
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: reqParams,
    });
  } catch (err) {
    if (err.response) return err;
    const error = new Error();
    error.cError = { code: 'N/A', title: 'AXIOS ERROR', detail: 'Error occured while establishing connection to the server' };
    throw error;
  }
};

export const patch = async (path, token, reqParams) => {
  try {
    return await axios({
      url: 'http://' + host + ':' + port + '/api/v1/' + path,
      method: 'patch',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: reqParams,
    });
  } catch (err) {
    if (err.response) return err;
    const error = new Error();
    error.cError = { code: 'N/A', title: 'AXIOS ERROR', detail: 'Error occured while establishing connection to the server' };
    throw error;
  }
};

export const del = async (path, token) => {
  try {
    return await axios({
      url: 'http://' + host + ':' + port + '/api/v1/' + path,
      method: 'delete',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  } catch (err) {
    if (err.response) return err;
    const error = new Error();
    error.cError = { code: 'N/A', title: 'AXIOS ERROR', detail: 'Error occured while establishing connection to the server' };
    throw error;
  }
};

export const wait = async (seconds) => {
  await new Promise((r) => setTimeout(r, seconds * 1000));
};

export function generateRandomKey() {
  return Math.random() * 99999999999999 + 'rnd' + Math.random() * 5452145442254;
}
