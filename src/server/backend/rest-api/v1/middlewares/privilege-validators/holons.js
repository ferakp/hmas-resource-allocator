import * as utils from "../../utils/utils";
import * as errorMessages from "../../messages/errors";
import * as responseGenerators from "../../response-generators/holons";
import * as rDatabaseApi from "../../../../relational-database-api/api";

export async function getHolons(req, res, next) {
  next();
}

export async function patchHolon(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;
  const query = { id: Number(req.params.id) };

  // Get holon
  const holonResponse = await rDatabaseApi.getHolons({ filters: query });

  // Holon not found
  if (holonResponse.results.length !== 1) {
    validationErrors.push(errorMessages.HOLON_NOT_FOUND);
  } else {
    // Get user associated with holon
    const userResponse = await rDatabaseApi.getUsers({
      isForAuth: true,
      filters: { id: Number(holonResponse.results[0].created_by) },
    });
    // Check if permission validator returns errors
    validationErrors = validationErrors.concat(
      utils.hasPermissionToEdit({ requester, resourceOwner: userResponse.results[0] })
    );
  }

  // User has no privileges or errors occured
  if (validationErrors.length > 0) {
    const response = responseGenerators.patchHolon({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  next();
}

export async function postHolon(req, res, next) {
  next();
}

export async function deleteHolon(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;
  const query = { id: Number(req.params.id) };

  // Get holon
  const holonResponse = await rDatabaseApi.getHolons({ filters: query });

  // Holon not found
  if (holonResponse.results.length !== 1) {
    validationErrors.push(errorMessages.HOLON_NOT_FOUND);
  } else {
    // Get user associated with holon
    const userResponse = await rDatabaseApi.getUsers({
      isForAuth: true,
      filters: { id: Number(holonResponse.results[0].created_by) },
    });
    // Check if permission validator returns errors
    validationErrors = validationErrors.concat(
      utils.hasPermissionToEdit({ requester, resourceOwner: userResponse.results[0] })
    );
  }

  // User has no privileges or errors occured
  if (validationErrors.length > 0) {
    const response = responseGenerators.deleteHolon({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  next();
}
