import * as authResponseGenerators from "../../response-generators/auth";

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

  // If username or password are too short
  if (username.length < process.env.USER_MIN_USERNAME_LENGTH || password < process.env.USER_MIN_PASSWORD_LENGTH) {
    if (username.length < process.env.USER_MIN_USERNAME_LENGTH || password < process.env.USER_MIN_PASSWORD_LENGTH)
      responseDetails.errors.push(errorMessages.INVALID_USERNAME_AND_PASSWORD);
    else if (username.length < process.env.USER_MIN_USERNAME_LENGTH)
      responseDetails.errors.push(errorMessages.INVALID_USERNAME);
    else if (password < process.env.USER_MIN_PASSWORD_LENGTH)
      responseDetails.errors.push(errorMessages.INVALID_PASSWORD);
    const response = authResponseGenerators.login(responseDetails);
    if (response.errors.length > 0) res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  next();
}
