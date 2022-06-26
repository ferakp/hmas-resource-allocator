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

export const allFieldNames = [
  "id",
  "settings",
  "created_on",
  "updated_on",
];

export const allFieldConstraints = [
  ["number", "not null"],
  ["string", "not null"],
  ["date", "not null"],
  ["date", "not null"],
];

export const getSettings = {
  acceptedFieldNames: [
    "id",
    "settings",
    "created_on",
    "updated_on",
  ],
};

export const deleteSettings = {
  acceptedFieldNames: ["id"],
};

export const patchSettings = {
  acceptedFieldNames: [
    "settings"
  ],
};

export const postSettings = {
  requiredFieldNames: ["settings"],
  acceptedFieldNames: [
    "settings"
  ],
};
