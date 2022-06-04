import * as utils from "../../utils/utils";

const fields = [
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
const constraints = [
  ["Number", "NOT NULL"],
  ["String", "NOT NULL"],
  ["String", "NOT NULL"],
  ["String", "NOT NULL"],
  ["String", "NOT NULL"],
  ["String", "NOT NULL"],
  ["String", "NOT NULL"],
  ["Date", "NOT NULL"],
  ["Date"],
  ["Date", "NOT NULL"],
];

export function validateGetUser(parameters) {
  const { username, userId, filters } = parameters;
  let response = { errorCodes: [], result: false };
  const acceptedFields = [
    "id",
    "role",
    "username",
    "firstname",
    "lastname",
    "email",
    ...utils.generateComparableFields("created_on"),
    ...utils.generateComparableFields("last_login"),
    ...utils.generateComparableFields("updated_on"),
  ];

  // Validation for username
  if (username) {
    
    if (typeof username !== "string") response.errorCodes.push(13);
    if (response.errorCodes.length > 0) return response;
    else {
      response.result = true;
      return response;
    }
  }

  // Validation for userId and filters
  const objectFieldResult = utils.isObjectFieldsValid(filters, acceptedFields, fields, constraints);
  const isUserIdValid = utils.isFieldNumber(userId);

  if (!objectFieldResult.isKeyNamesValid) {
    response.errorCodes.push(5);
  } else if (!objectFieldResult.isKeyValuesValid) {
    response.errorCodes.push(4);
  } else if (!isUserIdValid) {
    response.errorCodes.push(6);
  } else response.result = true;

  return response;
}

export function validateEditUser(userId, attributes) {
  let response = { errorCodes: [], result: false };
  const acceptedFields = ["id", "role", "username", "firstname", "lastname", "email", "last_login"];

  // Validation when the filters has no fields
  if (typeof attributes !== "object" || !attributes.id || Object.keys(attributes).length < 2) {
    response.errorCodes.push(3);
    return response;
  }

  // Validation for the userId and the filters
  const objectFieldResult = utils.isObjectFieldsValid(attributes, acceptedFields, fields, fieldConstraints);
  const isUserIdValid = utils.isFieldNumber(userId);

  if (!objectFieldResult.isKeyNamesValid) {
    response.errorCodes.push(5);
  } else if (!objectFieldResult.isKeyValuesValid) {
    response.errorCodes.push(4);
  } else if (!isUserIdValid) {
    response.errorCodes.push(6);
  } else response.result = true;

  return response;
}
