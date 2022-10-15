const axios = require('axios').default;

/**
 * FORMATTING
 */

export function formatHolon(holon) {
  try {
    holon.id = Number(holon.id);
    holon.type = holon.type.toString();
    holon.name = holon.name.toString();
    holon.gender = holon.gender ? holon.gender.toString() : null;
    holon.daily_work_hours = Number(holon.daily_work_hours);
    if (typeof holon.latest_state !== 'object') holon.latest_state = holon.latest_state ? JSON.parse(holon.latest_state) : null;
    holon.remote_address = holon.remote_address ? holon.remote_address : null;
    holon.api_token = holon.api_token ? holon.api_token : null;
    if (typeof holon.availability_data !== 'object')
      holon.availability_data = holon.availability_data ? JSON.parse(holon.availability_data) : { currentValue: 0, latestUpdate: new Date(), records: [] };
    if (typeof holon.cost_data !== 'object') holon.cost_data = holon.cost_data ? JSON.parse(holon.cost_data) : { currentValue: 0, latestUpdate: new Date(), records: [] };
    if (typeof holon.load_data !== 'object') holon.load_data = holon.load_data ? JSON.parse(holon.load_data) : { currentValue: 0, latestUpdate: new Date(), records: [] };
    if (typeof holon.stress_data !== 'object') holon.stress_data = holon.stress_data ? JSON.parse(holon.stress_data) : { currentValue: 0, latestUpdate: new Date(), records: [] };
    holon.age = isNumber(holon.age) ? Number(holon.age) : null;
    holon.experience_years = isNumber(holon.experience_years) ? Number(holon.experience_years) : null;
    holon.created_on = new Date(holon.created_on);
    holon.created_by = Number(holon.created_by);
    holon.updated_on = new Date(holon.updated_on);
    holon.is_available = convertToBoolean(holon.is_available) ? true : false;
    return holon;
  } catch (err) {
    throw new Error();
  }
}

export function formatTask(task) {
  try {
    task.id = Number(task.id);
    task.type = task.type ? task.type.toString() : null;
    task.is_completed = convertToBoolean(task.is_completed) ? true : false;
    task.completed_on = task.completed_on ? new Date(task.completed_on) : null;
    task.name = task.name ? task.name.toString() : null;
    task.description = task.description ? task.description.toString() : null;
    task.estimated_time = isNumber(task.estimated_time) ? Number(task.estimated_time) : null;
    if (typeof task.knowledge_tags !== 'object') task.knowledge_tags = task.knowledge_tags ? JSON.parse(task.knowledge_tags) : { tags: [] };
    if (typeof task.resource_demand !== 'object') task.resource_demand = task.resource_demand ? JSON.parse(task.resource_demand) : { demands: [] };
    task.priority = isNumber(task.priority) ? Number(task.priority) : 0;
    task.created_on = new Date(task.created_on);
    task.created_by = isNumber(task.created_by) ? Number(task.created_by) : null;
    task.start_date = task.start_date ? new Date(task.start_date) : null;
    task.due_date = task.due_date ? new Date(task.due_date) : null;
    if (typeof task.assigned_to !== 'object') task.assigned_to = task.assigned_to ? JSON.parse(task.assigned_to) : { ids: [] };
    task.updated_on = task.updated_on ? new Date(task.updated_on) : null;
    return task;
  } catch (err) {
    throw new Error();
  }
}

export function formatUser(user) {
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
    return user;
  } catch (err) {
    throw new Error();
  }
}

export function formatAllocation(allocation) {
  try {
    allocation.id = Number(allocation.id);
    allocation.request_by = Number(allocation.request_by);
    if (!Array.isArray(allocation.request?.holonIds) && !Array.isArray(allocation.request?.taskIds) && !allocation.request.algorithm)
      allocation.request = allocation.request && typeof allocation.request === 'string' ? JSON.parse(allocation.request) : null;
    if (!Array.isArray(allocation.result?.allocations) && !allocation.result?.error)
      allocation.result = allocation.result && typeof allocation.result === 'string' ? JSON.parse(allocation.result) : null;
    allocation.created_on = new Date(allocation.created_on);
    allocation.start_time = allocation.start_time ? new Date(allocation.start_time) : null;
    allocation.end_time = allocation.end_time ? new Date(allocation.end_time) : null;
    allocation.reallocate = Boolean(allocation.reallocate);
    allocation.updated_on = new Date(allocation.updated_on);
    allocation.completed_on = allocation.completed_on ? new Date(allocation.completed_on) : null;
    return allocation;
  } catch (err) {
    throw new Error();
  }
}

/**
 * Formats to DD.MM.YYYY HH:MM
 * @param {string} date
 */
export const formatDate = (date) => {
  if (isDate(new Date(date))) {
    date = new Date(date);
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
  } else return 'N/A';
};

/**
 * Formats date to Weekday MonthNumber Month Hour Minutes
 */
export const formatDateForDisplay = (date) => {
  let createdOnText = 'N/A';
  try {
    const created_date = date;
    if (created_date) createdOnText = created_date.toLocaleString('en-us', { weekday: 'short' }) + ' ' + created_date.getDate() + ' ' + created_date.toDateString().split(' ')[1];
    const hours = created_date.getHours() > 9 ? created_date.getHours() : '0' + created_date.getHours();
    const minutes = created_date.getMinutes() > 9 ? created_date.getMinutes() : '0' + created_date.getMinutes();
    createdOnText += ' ' + hours + ':' + minutes;
    if (!created_date && this.props.data.created_on) createdOnText = 'Not Available';
  } catch (err) {
    createdOnText = 'N/A';
  }
  return createdOnText;
};

/**
 * VALIDATION
 */

export function isDate(param) {
  if (param instanceof Date && !isNaN(param)) {
    return true;
  } else return false;
}

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
    if (data.status) state.data.status = data.status;
    updateInProgress = false;
  } catch (err) {
    updateInProgress = false;
  }
}

export const debounceUpdateData = shortDebounce((state, data) => updateData(state, data));

export function debounce(func) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, 200);
  };
}

export function shortDebounce(func) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, 50);
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
        allocation = formatAllocation(allocation);
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
        holon = formatHolon(holon);
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
        user = formatUser(user);
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

/**
 * Update the state with the updated task
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
 * Update the state with the updated user
 * @param {object} state state of the app
 * @param {object} user user object
 * @returns boolean
 */
export const updateUser = debounce((state, user) => {
  try {
    const formattedUser = formatUser(user);
    for (let i = 0; i < state.data.users.length; i++) {
      if (state.data.users[i].id === formattedUser.id) {
        state.data.users[i] = formattedUser;
        return true;
      }
    }
  } catch (err) {
    return false;
  }
});

/**
 * Update the state with the updated allocation
 * @param {object} state state of the app
 * @param {object} allocation allocation object
 * @returns boolean
 */
export const updateAllocation = (state, allocation) => {
  try {
    const formattedAllocation = formatAllocation(allocation);
    for (let i = 0; i < state.data.allocations.length; i++) {
      if (state.data.allocations[i].id === formattedAllocation.id) {
        state.data.allocations[i] = formattedAllocation;
        return true;
      }
    }
  } catch (err) {
    return false;
  }
};

/**
 * Adds a new allocation to the state (app's state)
 * @param {object} state state of the app
 * @param {object} allocation allocation object
 * @returns boolean
 */
export const addAllocation = shortDebounce((state, allocation) => {
  try {
    const formattedAllocation = formatAllocation(allocation);
    state.data.allocations.push(formattedAllocation);
  } catch (err) {
    return false;
  }
});

/**
 * Update the holon from the inside state data
 * @param {object} state state of the app
 * @param {object} holon holon object
 * @returns boolean
 */
export const updateHolon = (state, holon) => {
  try {
    const formattedHolon = formatHolon(holon);
    for (let i = 0; i < state.data.holons.length; i++) {
      if (state.data.holons[i].id === formattedHolon.id) {
        state.data.holons[i] = formattedHolon;
        return true;
      }
    }
  } catch (err) {
    return false;
  }
};

/**
 * Adds a new holon to the state (app's state)
 * @param {object} state state of the app
 * @param {object} holon holon object
 * @returns boolean
 */
export const addHolon = shortDebounce((state, holon) => {
  try {
    const formattedHolon = formatHolon(holon);
    state.data.holons.push(formattedHolon);
  } catch (err) {
    return false;
  }
});

/**
 * Deletes the task with given id from the state data
 * @param {number} id task ID
 * @returns boolean
 */
export const deleteTask = (state, id) => {
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
};

/**
 * Deletes the holon with given id from the state data
 * @param {number} id holon ID
 * @returns boolean
 */
export const deleteHolon = (state, id) => {
  try {
    for (let i = 0; i < state.data.holons.length; i++) {
      if (Number(state.data.holons[i].id) === Number(id)) {
        state.data.holons.splice(i, 1);
        return true;
      }
    }
  } catch (err) {
    return false;
  }
};

/**
 * Deletes the allocation with given id from the state data
 * @param {number} id allocation ID
 * @returns boolean
 */
export const deleteAllocation = (state, id) => {
  try {
    for (let i = 0; i < state.data.allocations.length; i++) {
      if (Number(state.data.allocations[i].id) === Number(id)) {
        state.data.allocations.splice(i, 1);
        return true;
      }
    }
  } catch (err) {
    return false;
  }
};

/**
 * Deletes the user with given id from the state data
 * @param {number} id user ID
 * @returns boolean
 */
export const deleteUser = (state, id) => {
  try {
    for (let i = 0; i < state.data.users.length; i++) {
      if (Number(state.data.users[i].id) === Number(id)) {
        state.data.users.splice(i, 1);
        return true;
      }
    }
  } catch (err) {
    return false;
  }
};

/**
 * Add a new task
 * @param {object} task new task
 * @returns boolean
 */
export const addTask = debounce((state, task) => {
  try {
    const formattedTask = formatTask(task);
    state.data.tasks.push(formattedTask);
    return true;
  } catch (err) {
    return false;
  }
});

/**
 * Add a new user
 * @param {object} user new user
 * @returns boolean
 */
export const addUser = debounce((state, user) => {
  try {
    const formattedUser = formatUser(user);
    state.data.users.push(formattedUser);
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

export function convertToBoolean(result) {
  if (typeof result === 'string' && result === 'true') return true;
  else if (typeof result === 'string' && result === 'false') return true;
  else if (typeof result === 'boolean') return result;
  else return null;
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
    array.sort((a, b) => {
      if (a[fieldName] < b[fieldName]) return -1;
      else if (a[fieldName] > b[fieldName]) return 1;
      else return 0;
    });
    if (isAscendant) return array;
    else return array.reverse();
  } catch (err) {
    return newArray;
  }
}

export const getWeekNumber = (date) => {
  if (!isDate(date)) return -1;
  let currentdate = date;
  let oneJan = new Date(currentdate.getFullYear(), 0, 1);
  let numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
  return weekNumber;
};

/**
 * AJAX CALLS
 */

const host = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_REST_HOST || 'localhost' : 'localhost';
const port = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_REST_PORT || 80 : 5000;
const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
const urlBase = process.env.REACT_APP_REST_PORT === 80 ? protocol + '://' + host : protocol + '://' + host + ':' + port;

export const login = async (username, password) => {
  try {
    return await axios({
      url: urlBase + '/api/v1/auth/login',
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
      url: urlBase + '/api/v1/' + path + '/' + query,
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
      url: urlBase + '/api/v1/' + path,
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
      url: urlBase + '/api/v1/' + path,
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
      url: urlBase + '/api/v1/' + path,
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
