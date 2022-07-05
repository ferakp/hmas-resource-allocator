const axios = require('axios').default;
import jsonwebtoken from 'jsonwebtoken';

export const login = async (username, password) => {
  try {
    return await axios({
      url: 'http://localhost:5000/api/v1/auth/login',
      method: 'get',
      headers: {
        Authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
      },
    });
  } catch (err) {
    return err;
  }
};

export const getUsers = async (token, query = '') => {
  try {
    return await axios({
      url: 'http://localhost:5000/api/v1/users' + query,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  } catch (err) {
    return err;
  }
};

export const get = async (path, query, token) => {
  try {
    return await axios({
      url: 'http://localhost:5000/api/v1/' + path + '/' + query,
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
      url: 'http://localhost:5000/api/v1/' + path,
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
      url: 'http://localhost:5000/api/v1/' + path,
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
      url: 'http://localhost:5000/api/v1/' + path,
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
