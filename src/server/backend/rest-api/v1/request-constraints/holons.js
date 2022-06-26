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
 */

export const allFieldNames = [
  "id",
  "type",
  "name",
  "gender",
  "daily_work_hours",
  "latest_state",
  "remote_address",
  "api_token",
  "availability_data",
  "load_data",
  "stress_data",
  "cost_data",
  "age",
  "experience_years",
  "created_on",
  "updated_on",
  "created_by",
];

export const allFieldConstraints = [
  ["number", "not null"],
  ["string", "not null"],
  ["string", "not null"],
  ["string"],
  ["number", "not null"],
  ["string"],
  ["string"],
  ["string"],
  ["string", "not null"],
  ["string", "not null"],
  ["string", "not null"],
  ["string", "not null"],
  ["number"],
  ["number"],
  ["date"],
  ["date"],
  ["number"],
];

export const getHolons = {
  acceptedFieldNames: [
    "id",
    "type",
    "name",
    "gender",
    ...utils.generateComparableFields("daily_work_hours"),
    ...utils.generateComparableFields("age"),
    ...utils.generateComparableFields("experience_years"),
    ...utils.generateComparableFields("created_on"),
    ...utils.generateComparableFields("updated_on"),
    "created_by",
  ],
};

export const deleteHolon = {
  acceptedFieldNames: ["id"],
};

export const patchHolon = {
  acceptedFieldNames: [
    "type",
    "name",
    "gender",
    "daily_work_hours",
    "latest_state",
    "remote_address",
    "api_token",
    "availability_data",
    "load_data",
    "stress_data",
    "cost_data",
    "age",
    "experience_years",
  ],
};

export const postHolon = {
    acceptedFieldNames : [
        "type",
        "name",
        "gender",
        "daily_work_hours",
        "latest_state",
        "remote_address",
        "api_token",
        "availability_data",
        "load_data",
        "stress_data",
        "cost_data",
        "age",
        "experience_years",
    ]
};
