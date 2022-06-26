import jsonwebtoken from "jsonwebtoken";
import * as rDatabaseApi from "../../../relational-database-api/api";
import * as authResponseGenerators from "../response-generators/auth";
import * as errorMessages from "../messages/errors";
import bcrypt from "bcrypt";

export async function login(req, res) {
  const responseDetails = { req, res, errors: [], token: null };
 
  // Parse authorization header
  let authHeader = req.headers.authorization;
  let auth = new Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
  const username = auth[0];
  const password = auth[1];

  // Get user with given username
  const { errors, results } = await rDatabaseApi.getUsers({ isForAuth: true, filters: {username: username}});

  // If error occurs
  if(errors.length > 0) {
    responseDetails.errors = errors;
    const response = authResponseGenerators.login(responseDetails);
    if (response.errors.length > 0) res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // If username is not found
  if (errors.length === 0 && results.length === 0) {
    responseDetails.errors.push(errorMessages.INVALID_USERNAME);
    const response = authResponseGenerators.login(responseDetails);
    if (response.errors.length > 0) res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // If username is found
  if (errors.length === 0 && results.length === 1) {
    // If password is correct
    if (await isPasswordCorrect(password, results[0].password)) {
      rDatabaseApi.userHasLoggedIn(results[0]?.id);
      responseDetails.token = generateAccessToken({ userId: results[0].id });
      const response = authResponseGenerators.login(responseDetails);
      res.status(200);
      res.json(response);
      return;
    }

    // If password is incorrect
    responseDetails.errors.push(errorMessages.INVALID_PASSWORD);
    const response = authResponseGenerators.login(responseDetails);
    res.status(response.errors[0].status);
    res.json(response);
  }
}

export async function refreshToken(req, res) {
  const responseDetails = {req, res, token: null};
  const user = req.user;

  responseDetails.token = generateAccessToken({ userId: req.user.id });
  const response = authResponseGenerators.refreshToken(responseDetails);
  res.status(200);
  res.json(response);
}

// UTILITY FUNCTIONS

function generateAccessToken(payload) {
  return jsonwebtoken.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "6h",
  });
}

async function isPasswordCorrect(plainPassword, hash) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(plainPassword, hash, function (err, res) {
      if (err) {
        resolve(false);
      } else {
        resolve(res);
      }
    });
  });
}

async function encryptPassword(plainPassword) {
  return new Promise(function (resolve, reject) {
    bcrypt.hash(plainPassword, 10, function (err, hash) {
      if (err) {
        resolve(null);
      } else {
        resolve(hash);
      }
    });
  });
}
