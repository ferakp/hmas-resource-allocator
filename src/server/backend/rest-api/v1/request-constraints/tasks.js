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
  "type",
  "name",
  "description",
  "estimated_time",
  "knowledge_tags",
  "resource_demand",
  "priority",
  "created_on",
  "created_by",
  "start_date",
  "due_date",
  "assigned_to",
  "updated_on",
];

export const allFieldConstraints = [
  ["number", "not null"],
  ["string", "not null"],
  ["string", "not null"],
  ["string"],
  ["number"],
  ["string"],
  ["string"],
  ["number"],
  ["date", "not null"],
  ["number", "not null"],
  ["date"],
  ["date"],
  ["string"],
  ["date", "not null"],
];

export const getTasks = {
  acceptedFieldNames: [
    "id",
    "type",
    "name",
    "description",
    "estimated_time",
    "knowledge_tags",
    "resource_demand",
    ...utils.generateComparableFields("priority"),
    ...utils.generateComparableFields("created_on"),
    "created_by",
    ...utils.generateComparableFields("start_date"),
    ...utils.generateComparableFields("due_date"),
    "assigned_to",
    ...utils.generateComparableFields("updated_on"),
  ],
};

export const deleteTask = {
  acceptedFieldNames: ["id"],
};

export const patchTask = {
  acceptedFieldNames: [
    "type",
    "name",
    "description",
    "estimated_time",
    "knowledge_tags",
    "resource_demand",
    "priority",
    "start_date",
    "due_date",
    "assigned_to",
  ],
};

export const postTasks = {
  requiredFieldNames: ["name", "description"],
  acceptedFieldNames: [
    "type",
    "name",
    "description",
    "estimated_time",
    "knowledge_tags",
    "resource_demand",
    "priority",
    "start_date",
    "due_date",
    "assigned_to",
  ],
};
