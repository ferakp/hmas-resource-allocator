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
 * 
 */

export const allFieldNames = [
    "id",
    "role",
    "username",
    "password",
    "firstname",
    "lastname",
    "email",
    "created_on",
    "last_login",
    "updated_on",
  ];

export const allFieldConstraints = [
    ["number", "not null"],
    ["string", "not null"],
    ["string", "not null"],
    ["string", "not null"],
    ["string", "not null"],
    ["string", "not null"],
    ["string", "not null"],
    ["date", "not null"],
    ["date"],
    ["date", "not null"],
  ];

export const getUsers = {

      acceptedFieldNames : [
        "id",
        "role",
        "username",
        "firstname",
        "lastname",
        "email",
        ...utils.generateComparableFields("created_on"),
        ...utils.generateComparableFields("last_login"),
        ...utils.generateComparableFields("updated_on"),
      ]
}

export const deleteUser = {
  acceptedFieldNames : [
    "id"
  ]
}

export const patchUser = {
  acceptedRoles: ["user", "moderator", "admin"],
  acceptedFieldNames : [
    "role",
    "password",
    "firstname",
    "lastname",
    "email",
  ]
}

export const postUser = {
  acceptedRoles: ["user", "moderator", "admin"],
  acceptedFieldNames : [
    "role",
    "username",
    "password",
    "firstname",
    "lastname",
    "email",
  ]
}