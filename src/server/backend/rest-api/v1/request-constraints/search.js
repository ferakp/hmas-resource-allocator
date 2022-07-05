import * as utils from '../utils/utils';

/**
 *
 * DO NOT ADD FIELDS THAT CONTAIN . (DOT) CHARACTER
 * DOT (.) IS RESEVED FOR OPERATORS .e .elt .egt .lt .gt
 *
 * DEFINITION OF OPERATORS
 * .e   EQUAL
 * .elt EQUAL AND LESS THAN
 * .egt EQUAL AND GREATER THAN
 * .lt  LESS THAN
 * .gt  GREATER THAN
 *
 *
 */

export const allFieldNames = ['type', 'resource', 'latest_update', 'ids'];

export const allFieldConstraints = [['string', 'not null'], ['string', 'not null'], ['date'], ['array', 'not null']];

export const postSearch = {
  requiredFieldNames: ['type', 'resource', 'ids'],
  acceptedFieldValues: [['bulk-search', 'bulk-update-check'], ['users', 'holons', 'tasks', 'allocations'], 'string', 'array'],
  acceptedFieldNames: ['type', 'resource', 'latest_update', 'ids'],
};
