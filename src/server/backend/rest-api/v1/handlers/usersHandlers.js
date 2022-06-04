import * as rDatabaseApi from "../../../relational-database/api";
import * as usersResponseGenerator from "../response-generators/users";
import * as utils from "../utils/utils";
import * as errorMessages from "../messages/errors";

export async function getUsers(req, res) {
  const responseDetails = { req, res, errorCodes: [], results: [] };

  let filters = req.query;
  const user = req.user;
  utils.hasFieldWithValue(req.params, "id") ? (filters = { ...filters, id: req.params.id }) : "";

  // Get users with given filters
  const { errorCodes, results } = await rDatabaseApi.getUsers({ user, filters });
  responseDetails.errorCodes = errorCodes || [];
  responseDetails.results = results || [];

  // If request path was /users/id and it didn't exist
  if (
    responseDetails.errorCodes.length === 0 &&
    responseDetails.results.length === 0 &&
    utils.hasFieldWithValue(req.params, "id")
  ) {
    responseDetails.errorCodes.push(errorMessages.USER_NOT_FOUND.code);
  }

  // Generate response
  const response = usersResponseGenerator.getUsers(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

export async function createUser(req, res) {
  let newHolon = req.body.holon;
  const { errorCodes, dbErrorMessage, results } = await rDatabaseApi.createHolon(req.user.userId, newHolon);
  console.log(errorCodes, dbErrorMessage, results);
  res.sendStatus(200);
}

export async function editUser(req, res) {
  let modifiedHolon = req.body.holon;

  const { err, holon } = await rDatabaseApi.editHolon(req.user.userId, modifiedHolon);
  res.json(holon);
}

export async function deleteUser(req, res) {
  let deletedHolonId = req.params.holonId;

  const { err, holonId } = await rDatabaseApi.deleteHolon(req.user.userId, deletedHolonId);
  res.json(holonId);
}
