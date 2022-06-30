import * as utils from "../utils/utils";

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
 *
 *
 */

export const allFieldNames = ["id", "type", "name", "description", "created_on", "updated_on", "created_by"];

export const allFieldConstraints = [
  ["number", "not null"],
  ["string", "not null"],
  ["string", "not null"],
  ["string", "not null"],
  ["date", "not null"],
  ["date", "not null"],
  ["number", "not null"],
];

export const postAlgorithm = {
  requiredFieldNames: ["type", "name", "description"],
  acceptedFieldNames: ["type", "name", "description"],
};

export const patchAlgorithm = {
  acceptedFieldNames: ["type", "name", "description"],
};

export const deleteAlgorithm = {
  acceptedFieldNames: ["id"],
};
