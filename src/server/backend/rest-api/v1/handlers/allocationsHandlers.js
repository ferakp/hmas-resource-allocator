import * as rDatabaseApi from '../../../relational-database-api/api';
import * as utils from '../utils/utils';
import * as errorMessages from '../messages/errors';
import * as actions from '../messages/actions';
import * as requestConstraints from '../request-constraints/allocations';
import * as usersResponseGenerator from '../response-generators/allocations';

/**
 * GET /allocations and /allocations/:id
 */

export async function getAllocations(req, res) {}

/**
 * POST /allocations/:id and /allocations/:id/complete-requests
 */

export async function postAllocation(req, res) {}

export async function postAllocationCompleteRequests(req, res) {}

/**
 * PATCH /allocations/:id
 */

export async function patchAllocation(req, res) {}

/**
 * DELETE /allocations/:id
 */
export async function deleteAllocation(req, res) {}
