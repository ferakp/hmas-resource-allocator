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

  // Return error if search was conducted on :id which doesn't exist
  if (utils.hasFieldWithValue(req.params, 'id') && responseDetails.errors.length === 0 && responseDetails.results.length === 0) {
    responseDetails.errors.push(errorMessages.ALLOCATION_NOT_FOUND);
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
      if (!result.error) {
        if (!result.allocations) throw new Error();

        result.allocations.forEach((alloc) => {
          if (!utils.isNumber(alloc.taskId) || !Array.isArray(alloc.holonIds) || !alloc.holonIds.every((id) => utils.isNumber(id))) throw new Error();
        });
      }
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
  if (responseDetails.errors.length === 0 && responseDetails.results.length === 0) {
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
  reqParams.id = Number(req.params.id);

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
      // Allocation has incorrect result
      else if (!allocation.result.error && (!Array.isArray(allocation.result.allocations) || allocation.result.allocations.length === 0)) {
        responseDetails.errors.push(errorMessages.INVALID_ALLOCATION_RESULT);
      }
      // The allocation's result field contains error message
      else if (allocation.result.error) {
        responseDetails.errors.push(errorMessages.NO_ALLOCABLE_RESULT);
      }
      // Allocation is ready and the result has either the error message or the allocations array
      else {
        try {
          // Each allocation element has following fields: taskId and holonIds
          const allocationResults = allocation.result.allocations || [];
          let taskIds = allocationResults.map((e) => e.taskId);
          let holonIds = [];
          allocationResults.forEach((i) => {
            if (Array.isArray(i.holonIds)) holonIds.push(...i.holonIds);
          });
          // Remove tasks and holons whose ID is not number
          taskIds = taskIds.filter((id) => utils.isNumber(id));
          holonIds = holonIds.filter((id) => utils.isNumber(id));
          // Remove duplicate IDs
          holonIds = utils.removeDuplicateElements(holonIds);

          if (taskIds.length > 0) {
            // Get tasks and holons from database
            const taskResults = await rDatabaseApi.search({ requester, reqParams: { type: 'bulk-search', resource: 'tasks', ids: taskIds } });
            let holonResults = { errors: [], results: [] };
            if (holonIds.length > 0) holonResults = await rDatabaseApi.search({ requester, reqParams: { type: 'bulk-search', resource: 'holons', ids: holonIds } });
            responseDetails.errors = responseDetails.errors.concat(holonResults.errors);
            responseDetails.errors = responseDetails.errors.concat(taskResults.errors);

            // Requested holons and tasks have been retrieved from the database without errors
            if (responseDetails.errors.length === 0 && taskResults.results.length > 0) {
              // Assign each task to its allocation result
              taskResults.results.forEach((task) => {
                for (let i = 0; i < allocationResults.length; i++) {
                  if (Number(allocationResults[i].taskId) === Number(task.id)) {
                    allocationResults[i].task = task;
                  }
                }
              });

              // Assign each holon to its allocation result
              holonResults.results.forEach((holon) => {
                for (let i = 0; i < allocationResults.length; i++) {
                  if (allocationResults[i].holonIds.includes(Number(holon.id))) {
                    if (!Array.isArray(allocationResults[i].holons)) allocationResults[i].holons = [];
                    allocationResults[i].holons.push(holon);
                  }
                }
              });

              const updatedTasks = [];
              const updatedHolons = [];

              // Assign holons to their tasks
              allocationResults.forEach((allocation) => {
                try {
                  // Make sure the task and holons have been retrieved and the task has correct assigned_to field
                  if (!allocation.task) return;
                  let taskAssignedToField = !allocation.task.assigned_to ? { ids: [] } : JSON.parse(allocation.task.assigned_to);
                  if (!Array.isArray(taskAssignedToField.ids)) taskAssignedToField.ids = [];
                  if (!Array.isArray(allocation.holons)) allocation.holons = [];
                  taskAssignedToField.ids = allocation.holons.map((i) => Number(i.id));
                  allocation.task.assigned_to = JSON.stringify(taskAssignedToField);
                  updatedTasks.push(allocation.task);
                } catch (err) {
                  let taskAssignedToField = { ids: [] };
                  if (!Array.isArray(allocation.holons)) allocation.holons = [];
                  taskAssignedToField.ids = allocation.holons.map((i) => Number(i.id));
                  allocation.task.assigned_to = JSON.stringify(taskAssignedToField);
                  updatedTasks.push(allocation.task);
                }
              });

              // Set the currentValue of each holons's availability_data to 1
              allocationResults.forEach((allocation) => {
                // Skip allocation whic has no retrieved holons
                if (!Array.isArray(allocation.holons) || allocation.holons.length === 0) return;
                allocation.holons.forEach((holon) => {
                  try {
                    let availabilityDataField = holon.availability_data ? JSON.parse(holon.availability_data) : { currentValue: 0, records: [], latestUpdate: new Date() };
                    availabilityDataField.records.push([availabilityDataField.currentValue, availabilityDataField.latestUpdate]);
                    availabilityDataField.currentValue = 1;
                    availabilityDataField.latestUpdate = new Date();
                    holon.availability_data = JSON.stringify(availabilityDataField);
                    updatedHolons.push(holon);
                  } catch (err) {
                    let availabilityDataField = { currentValue: 0, records: [], latestUpdate: new Date() };
                    availabilityDataField.records.push([availabilityDataField.currentValue, availabilityDataField.latestUpdate]);
                    availabilityDataField.currentValue = 1;
                    availabilityDataField.latestUpdate = new Date();
                    holon.availability_data = JSON.stringify(availabilityDataField);
                    updatedHolons.push(holon);
                  }
                });
              });

              // Update tasks to database
              for (let i = 0; i < updatedTasks.length; i++) {
                try {
                  const taskResults = await rDatabaseApi.editTask({
                    reqParams: {
                      id: Number(updatedTasks[i].id),
                      assigned_to: updatedTasks[i].assigned_to,
                    },
                  });
                  if (taskResults.errors.length > 0) throw new Error();
                } catch (err) {
                  throw new Error();
                }
              }

              // Update holons to database
              for (let i = 0; i < updatedHolons.length; i++) {
                try {
                  const holonResults = await rDatabaseApi.editHolon({
                    reqParams: {
                      id: Number(updatedHolons[i].id),
                      availability_data: updatedHolons[i].availability_data,
                    },
                  });
                  if (holonResults.errors.length > 0) throw new Error();
                } catch (err) {
                  throw new Error();
                }
              }

              
              const completedOnResults = await rDatabaseApi.editAllocation({ reqParams: { id: Number(req.params.id), completed_on: new Date() } });
              if (completedOnResults.errors > 0) throw new Error();
              else responseDetails.results.push(completedOnResults.results[0]);
            }
            // Either database returned error OR no holons or/and tasks
            else {
              if (taskResults.results.length === 0) responseDetails.errors.push(errorMessages.NO_ALLOCABLE_RESULT);
              else responseDetails.errors.push(errorMessages.FAILED_TO_COMPLETE_ALLOCATION);
            }
          }
          // No valid holons or valid tasks to complete operation
          else {
            responseDetails.errors.push(errorMessages.NO_ALLOCABLE_RESULT);
          }
        } catch (err) {
          console.log(err);
          // Failed to complete allocation
          responseDetails.errors.push(errorMessages.FAILED_TO_COMPLETE_ALLOCATION);
        }
      }
    }
  } else {
    // Return error if more than one allocation is returned
    if (responseDetails.results.length > 1) responseDetails.errors.push(errorMessages.UNEXPECTED_DATABASE_RESPONSE_ERROR);
    // Allocation was not found
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
  let reqParams = JSON.parse(JSON.stringify({ reallocate: true, start_time: null, end_time: null, completed_on: null }));
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
