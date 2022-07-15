const axios = require('axios').default;


/**
 * AJAX CALLS
 */

const host = "localhost";
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
    const error = new Error();
    error.cError = {code: "N/A", title: "AXIOS ERROR", detail: "Error occured while establishing connection to the server"};
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
    const error = new Error();
    error.cError = {code: "N/A", title: "AXIOS ERROR", detail: "Error occured while establishing connection to the server"};
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
    const error = new Error();
    error.cError = {code: "N/A", title: "AXIOS ERROR", detail: "Error occured while establishing connection to the server"};
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
    const error = new Error();
    error.cError = {code: "N/A", title: "AXIOS ERROR", detail: "Error occured while establishing connection to the server"};
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
    const error = new Error();
    error.cError = {code: "N/A", title: "AXIOS ERROR", detail: "Error occured while establishing connection to the server"};
    throw error;
  }
};

export const wait = async (seconds) => {
  await new Promise((r) => setTimeout(r, seconds * 1000));
};