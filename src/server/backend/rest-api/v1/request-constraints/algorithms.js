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

export const allFieldNames = ["id", "type", "name", "created_on", "updated_on", "created_by"];

export const allFieldConstraints = [
  ["number", "not null"],
  ["string", "not null"],
  ["string", "not null"],
  ["date", "not null"],
  ["date", "not null"],
  ["number", "not null"],
];

export const getAlgorithms = {
  acceptedFieldNames: [
    "id",
    "request_by",
    ...utils.generateComparableFields("created_on"),
    ...utils.generateComparableFields("completed_on"),
    ...utils.generateComparableFields("updated_on"),
  ],
};

export const postAllocations = {
  requiredFieldNames: ["request_by", "request"],
  acceptedFieldNames: ["request_by", "request", "result", "created_on", "completed_on", "updated_on"],
};

export const patchAllocations = {
  acceptedFieldNames: ["result"],
};

export const deleteAllocations = {
  acceptedFieldNames: ["id"],
};
