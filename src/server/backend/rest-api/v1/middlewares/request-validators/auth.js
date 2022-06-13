import * as authResponseGenerators from "../../response-generators/auth";
import * as errorMessages from '../../messages/errors';

export async function login(req, res, next) {
  const responseDetails = { req, res, errors: [], token: null };
  let authHeader = req.headers.authorization;

  // Missing authentication credentials
  if (!authHeader || new Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":").length !== 2) {
    responseDetails.errors.push(errorMessages.MISSING_AUTHENTICATION_CREDENTIALS);
    const response = authResponseGenerators.login(responseDetails);
    if (response.errors.length > 0) res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Parse authorization header
  let auth = new Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
  const username = auth[0];
  const password = auth[1];

  // If username or password are missing
  if (username.length === 0 || password.length === 0) {
    if (username.length === 0 && password.length === 0)
      responseDetails.errors.push(errorMessages.INVALID_USERNAME_AND_PASSWORD);
    else if (username.length === 0)
      responseDetails.errors.push(errorMessages.INVALID_USERNAME);
    else if (password.length === 0)
      responseDetails.errors.push(errorMessages.INVALID_PASSWORD);
    const response = authResponseGenerators.login(responseDetails);
    if (response.errors.length > 0) res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  next();
}
