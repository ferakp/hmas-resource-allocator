import jsonwebtoken from "jsonwebtoken";
import * as errorMessages from "../../messages/errors";
import * as rDatabaseApi from "../../../../relational-database/api";
import * as checkAuthResponseGenerator from "../../response-generators/checkAuth";
import * as actions from "../../messages/actions";

export default async function checkAuth(req, res, next) {
  const responseDetails = { req, res, errors: [], actions: [] };
  let authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1];

  // Missing token
  if (!token) {
    responseDetails.errors.push(errorMessages.MISSING_TOKEN);
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
      responseDetails.errors.push(errorMessages.INVALID_TOKEN);
      responseDetails.actions.push(actions.LOGOUT);
      const response = checkAuthResponseGenerator.checkAuth(responseDetails);
      res.status(response.errors[0].status);
      res.json(response);
      return;
    }

    // Valid user token

    // Get user
    const { errors, results } = await rDatabaseApi.getUsers({
      isForAuth: true,
      filters: { id: payload.userId },
    });

    // If error occurs
    if (errors.length > 0) {
      responseDetails.errors = errors;
      const response = checkAuthResponseGenerator.checkAuth(responseDetails);
      res.status(response.errors[0].status);
      res.json(response);
      return;
    }

    // If user is not found
    if (results.length === 0) {
      responseDetails.errors.push(errorMessages.UNAUTHORIZED_API_CALL);
      responseDetails.actions.push(actions.LOGOUT);
      const response = checkAuthResponseGenerator.checkAuth(responseDetails);
      res.status(response.errors[0].status);
      res.json(response);
      return;
    }

    // If user is found
    if (results.length === 1) {
      req.requester = results[0];
      next();
    }
  });
}
