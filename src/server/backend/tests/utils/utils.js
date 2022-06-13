const axios = require("axios").default;
import jsonwebtoken from "jsonwebtoken";

export const login = async (username, password) => {
  try {
    return await axios({
      url: "http://localhost:5000/api/v1/auth/login",
      method: "get",
      headers: {
        Authorization: "Basic " + Buffer.from(username + ":" + password).toString("base64"),
      },
    });
  } catch (err) {
    return err;
  }
};

export const getUsers = async (token, query = "") => {
  try {
    return await axios({
      url: "http://localhost:5000/api/v1/users" + query,
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (err) {
    return err;
  }
};

export const post = async (path, token, reqParams) => {
  try {
    return await axios({
      url: "http://localhost:5000/api/v1/" + path,
      method: "post",
      headers: {
        Authorization: "Bearer " + token,
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
      url: "http://localhost:5000/api/v1/" + path,
      method: "patch",
      headers: {
        Authorization: "Bearer " + token,
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
      url: "http://localhost:5000/api/v1/" + path,
      method: "delete",
      headers: {
        Authorization: "Bearer " + token,
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
