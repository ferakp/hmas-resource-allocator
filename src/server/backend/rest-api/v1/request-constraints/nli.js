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

export const allFieldNames = ["text", "operation"];

export const allFieldConstraints = [
  ["string", "not null"],
  ["string", "not null"],
];

export const getNli = {
  acceptedFieldNames: ["text", "operation"],
};

export const postNli = {
  requiredFieldNames: ["text", "operation"],
  acceptedFieldNames: ["text", "operation"],
};
