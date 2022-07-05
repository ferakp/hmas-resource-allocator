import * as utils from '../../utils/utils';
import * as errorMessages from '../../messages/errors';
import * as responseGenerators from '../../response-generators/tasks';
import * as rDatabaseApi from '../../../../relational-database-api/api';

export async function getTasks(req, res, next) {
  // Pass
  next();
}

export async function postTask(req, res, next) {
  // Pass
  next();
}

export async function deleteTask(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;
  const query = { id: Number(req.params.id) };

  // Get task
  const taskResponse = await rDatabaseApi.getTasks({ filters: query });

  // Task not found
  if (taskResponse.results.length !== 1) {
    validationErrors.push(errorMessages.TASK_NOT_FOUND);
  } else {
    // Get user associated with task
    const userResponse = await rDatabaseApi.getUsers({
      isForAuth: true,
      filters: { id: Number(taskResponse.results[0].created_by) },
    });
    // Check if permission validator returns errors
    validationErrors = validationErrors.concat(utils.hasPermissionToEdit({ requester, resourceOwner: userResponse.results[0] }));
  }

  // User has no privileges or errors occured
  if (validationErrors.length > 0) {
    const response = responseGenerators.deleteTask({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }
  // Pass
  next();
}

export async function patchTask(req, res, next) {
  let validationErrors = [];
  const requester = req.requester;
  const query = { id: Number(req.params.id) };

  // Get task
  const taskResponse = await rDatabaseApi.getTasks({ filters: query });

  // Task not found
  if (taskResponse.results.length !== 1) {
    validationErrors.push(errorMessages.TASK_NOT_FOUND);
  } else {
    // Get user associated with task
    const userResponse = await rDatabaseApi.getUsers({
      isForAuth: true,
      filters: { id: Number(taskResponse.results[0].created_by) },
    });

    // Check if permission validator returns errors
    validationErrors = validationErrors.concat(utils.hasPermissionToEdit({ requester, resourceOwner: userResponse.results[0] }));
  }

  // User has no privileges or errors occured
  if (validationErrors.length > 0) {
    const response = responseGenerators.deleteTask({ req, res, errors: validationErrors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }
  // Pass
  next();
}
