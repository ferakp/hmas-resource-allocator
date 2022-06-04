import jsonwebtoken from "jsonwebtoken";
import * as errorMessages from "../../messages/errors";
import * as rDatabaseApi from "../../../../relational-database/api";
import * as checkAuthResponseGenerator from "../../response-generators/checkAuth";
import * as actions from "../../messages/actions";

export default async function checkAuth(req, res, next) {
  const responseDetails = { req, res, errorCodes: [], actionCodes: [] };
  let authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1];

  // Missing token
  if (!token) {
    responseDetails.push(errorMessages.MISSING_TOKEN.code);
    const response = checkAuthResponseGenerator.checkAuth(responseDetails);
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Token available

  // Verify token
  jsonwebtoken.verify(token, process.env.SECRET_KEY, async (err, payload) => {
    // Invalid user token
    if (err) {
      responseDetails.errorCodes.push(errorMessages.INVALID_TOKEN.code);
      responseDetails.actionCodes.push(actions.LOGOUT.code);
      const response = checkAuthResponseGenerator.checkAuth(responseDetails);
      res.status(response.errors[0].status);
      res.json(response);
      return;
    }

    // Valid user token

    // Get user
    const { errorCodes, results } = await rDatabaseApi.getUsers({
      user: {id: payload.userId},
      filters: { id: payload.userId },
    });

    // If error occurs
    if (errorCodes.length > 0) {
      responseDetails.errorCodes = errorCodes;
      const response = checkAuthResponseGenerator.checkAuth(responseDetails);
      res.status(response.errors[0].status);
      res.json(response);
      return;
    }

    // If user is not found
    if (results.length === 0) {
      responseDetails.errorCodes.push(errorMessages.UNAUTHORIZED_API_CALL.code);
      responseDetails.actionCodes.push(actions.LOGOUT.code);
      const response = checkAuthResponseGenerator.checkAuth(responseDetails);
      res.status(response.errors[0].status);
      res.json(response);
      return;
    }

    // If user is found
    if (results.length === 1) {
      req.user = results[0];
      next();
    }
  });
}
