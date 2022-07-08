import * as rDatabaseApi from '../../../relational-database-api/api';
import * as utils from '../utils/utils';
import * as errorMessages from '../messages/errors';
import * as actions from '../messages/actions';
import * as requestConstraints from '../request-constraints/allocations';
import * as responseGenerator from '../response-generators/allocations';

/**
 * GET /allocations and /allocations/:id
 */

export async function getAllocations(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let query = JSON.parse(JSON.stringify(req.query));
  const requester = req.requester;
  utils.hasFieldWithValue(req.params, 'id') ? (query.id = req.params.id) : '';

  // Formatting
  const formatResponse = utils.formatRequestQuery(query, requestConstraints.allFieldNames, requestConstraints.allFieldConstraints);
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else query = formatResponse.formattedQuery;

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Get allocations with given details
    const { errors, results } = await rDatabaseApi.getAllocations({ filters: query });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = responseGenerator.getAllocations(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * POST /allocations/:id, /allocations/:id/complete-requests and /allocations/:id/reallocate-requests
 */

export async function postAllocation(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let reqParams = JSON.parse(JSON.stringify(req.body));
  const requester = req.requester;

  // Fill missing fields
  reqParams['created_on'] = new Date();
  reqParams['updated_on'] = new Date();
  reqParams['request_by'] = Number(requester.id);
  reqParams['reallocate'] = true;

  // Formatting
  const formatResponse = utils.formatRequestQuery(reqParams, requestConstraints.allFieldNames, requestConstraints.allFieldConstraints);
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else reqParams = formatResponse.formattedQuery;

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Create task
    const { errors, results } = await rDatabaseApi.createAllocation({ reqParams });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = responseGenerator.postAllocation(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * PATCH /allocations/:id
 */

export async function patchAllocation(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let reqParams = JSON.parse(JSON.stringify(req.body));
  const requester = req.requester;
  utils.hasFieldWithValue(req.params, 'id') ? (reqParams.id = req.params.id) : '';

  // Fill missing fields
  reqParams['updated_on'] = new Date();

  // Formatting
  const formatResponse = utils.formatRequestQuery(reqParams, requestConstraints.allFieldNames, requestConstraints.allFieldConstraints);
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else reqParams = formatResponse.formattedQuery;

  // Validate reqParams.result
  if (reqParams.result) {
    try {
      const result = JSON.parse(reqParams.result);
      if (!result.allocations) throw new Error();

      result.allocations.forEach((alloc) => {
        if (!alloc.taskId || !alloc.holonIds) throw new Error();
      });
      reqParams['reallocate'] = false;
    } catch (err) {
      responseDetails.errors.push(errorMessages.INVALID_PARAMETER_VALUES);
    }
  }

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Edit allocation
    const { errors, results } = await rDatabaseApi.editAllocation({ reqParams });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Generate response
  const response = responseGenerator.patchAllocation(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * DELETE /allocations/:id
 */
export async function deleteAllocation(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let reqParams = JSON.parse(JSON.stringify({}));
  const requester = req.requester;
  utils.hasFieldWithValue(req.params, 'id') ? (reqParams.id = req.params.id) : '';

  // Formatting
  const formatResponse = utils.formatRequestQuery(reqParams, requestConstraints.allFieldNames, requestConstraints.allFieldConstraints);
  if (formatResponse.errors) responseDetails.errors = formatResponse.errors;
  else reqParams = formatResponse.formattedQuery;

  // Format is successfull
  if (responseDetails.errors.length === 0) {
    // Delete allocation
    const { errors, results } = await rDatabaseApi.deleteAllocation({ reqParams });
    responseDetails.errors = errors || [];
    responseDetails.results = results || [];
  }

  // Empty response means allocation didn't exist
  if(responseDetails.errors.length === 0 && responseDetails.results.length === 0) {
    responseDetails.errors.push(errorMessages.ALLOCATION_NOT_FOUND);
  }

  // Generate response
  const response = responseGenerator.deleteAllocation(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * POST /allocations/:id/complete-requests
 */
export async function postAllocationCompleteRequests(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let reqParams = JSON.parse(JSON.stringify({}));
  const requester = req.requester;
  utils.hasFieldWithValue(req.params, 'id') ? (reqParams.id = Number(req.params.id)) : '';

  // Get allocation
  const { errors, results } = await rDatabaseApi.getAllocations({ filters: reqParams });
  responseDetails.errors = errors || [];

  // Correct allocation is retrieved
  if (responseDetails.errors.length === 0 && results.length === 1) {
    // Format allocation resource by setting empty fields as null
    const { errors, allocation } = utils.formatAllocationForCompleteRequest(results[0]);
    responseDetails.errors = responseDetails.errors.concat(errors);

    // Allocation is formatted and validated with no errors
    if (responseDetails.errors.length === 0) {
      // Allocation is not ready
      if (!allocation.start_time || !allocation.result || !allocation.end_time) {
        responseDetails.errors.push(errorMessages.ALLOCATION_COMPLETE_REQUEST_NOT_ALLOWED);
      }
      // Allocation is ready and the result is correct
      else {
        try {
          // Each allocation element has following fields: taskId and holonIds
          const allocationResults = allocation.result.allocations;
          const taskIds = allocationResults.map((e) => Number(e.taskId));

          // Get tasks from database
          const taskResults = await rDatabaseApi.search({ requester, reqParams: { type: 'bulk-search', resource: 'tasks', ids: taskIds } });
          responseDetails.errors = responseDetails.errors.concat(taskResults.errors);

          // Database returned tasks with given ids
          if (responseDetails.errors.length === 0 && results.length > 0) {
            // Assign tasks to allocations object
            taskResults.results.forEach((task) => {
              for (let i = 0; i < allocationResults.length; i++) {
                if (Number(allocationResults[i].taskId) === Number(task.id)) {
                  allocationResults[i].task = task;
                }
              }
            });

            // Assign holon ids to assigned_to.ids fields
            allocationResults.forEach((alloc) => {
              try {
                const assignedTo = JSON.parse(alloc.assigned_to);
                assignedTo.ids = utils.removeDuplicateElements(assignedTo.ids.concat(alloc.holonIds));
                const reqParams = { assigned_to: JSON.stringify(assignedTo), id: alloc.taskId };
                alloc.reqParams = reqParams;
              } catch (err) {
                const assignedTo = { ids: [] };
                assignedTo.ids = utils.removeDuplicateElements(assignedTo.ids.concat(alloc.holonIds));
                const reqParams = { assigned_to: JSON.stringify(assignedTo), id: alloc.taskId };
                alloc.reqParams = reqParams;
              }
            });

            // Update tasks
            for (let i = 0; i < allocationResults.length; i++) {
              try {
                const taskResults = await rDatabaseApi.editTask({ reqParams: allocationResults[i].reqParams });
                if (taskResults.errors.length > 0) throw new Error();
                responseDetails.results.push(taskResults.results[0]);
              } catch (err) {
                throw new Error();
              }
            }

            const completedOnResults = await rDatabaseApi.editAllocation({ reqParams: { id: Number(req.params.id), completed_on: new Date() } });
            if (completedOnResults.errors > 0) throw new Error();
          }
        } catch (err) {
          // Failed to complete allocation
          responseDetails.errors.push(errorMessages.FAILED_TO_COMPLETE_ALLOCATION);
        }
      }
    }
  } else {
    // Return error if more than one resource is returned
    if (responseDetails.results.length > 1) responseDetails.errors.push(errorMessages.UNEXPECTED_DATABASE_RESPONSE_ERROR);
    if (responseDetails.results.length === 0 && responseDetails.errors.length === 0) responseDetails.errors.push(errorMessages.ALLOCATION_NOT_FOUND);
  }

  // Generate response
  const response = responseGenerator.postAllocationCompleteRequests(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}

/**
 * POST /allocations/:id/reallocate-requests
 */
export async function postReallocateRequests(req, res) {
  const responseDetails = { req, res, errors: [], results: [] };

  // Parameters
  let reqParams = JSON.parse(JSON.stringify({ reallocate: true }));
  const requester = req.requester;
  utils.hasFieldWithValue(req.params, 'id') ? (reqParams.id = Number(req.params.id)) : '';

  // Get allocation
  const allocationResults = await rDatabaseApi.getAllocations({ filters: { id: reqParams.id } });
  if (allocationResults.results.length === 0 && allocationResults.errors.length === 0) responseDetails.errors.push(errorMessages.ALLOCATION_NOT_FOUND);

  // Edit allocation
  if (responseDetails.errors.length === 0) {
    const { errors, results } = await rDatabaseApi.editAllocation({ reqParams });
    responseDetails.errors = responseDetails.errors.concat(errors);
    responseDetails.results = results;
  }

  // Generate response
  const response = responseGenerator.postReallocateRequests(responseDetails);

  // Return response
  if (response.errors.length > 0) {
    res.status(response.errors[0].status);
  } else res.status(200);
  res.json(response);
}
