import * as errorMessages from "../../messages/errors";
import * as utils from "../../util/utils";

const fields = [
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

const fieldConstraints = [
  ["Number", "NOT NULL"],
  ["String", "NOT NULL"],
  ["String", "NOT NULL"],
  ["String"],
  ["Number", "NOT NULL"],
  ["String"],
  ["String"],
  ["String"],
  ["String", "NOT NULL"],
  ["String", "NOT NULL"],
  ["String", "NOT NULL"],
  ["String", "NOT NULL"],
  ["Number"],
  ["Number"],
  ["Number"],
  ["Number"],
  ["Number"],
];

export function validateGetHolons(userId, filters) {
  let response = { errorCodes: [], result: false };

  let acceptedFields = [
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
  ];

  const objectFieldResult = utils.isObjectFieldsValid(filters, acceptedFields, fields, fieldConstraints);
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

export function validateCreateHolon(userId, holon) {
  let response = { errorCodes: [], result: false };
  const acceptedFields = [
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
    "created_by",
  ];
  const requiredFields = ["type", "name"];

  if(typeof holon !== 'object') {
    response.errorCodes.push(12);
    return response;
  }
      
  const objectFieldResult = utils.isObjectFieldsValid(holon, acceptedFields, fields, fieldConstraints);
  const isUserIdValid = utils.isFieldNumber(userId);

  if (!objectFieldResult.isKeyNamesValid) {
    response.errorCodes.push(7);
  } else if (!objectFieldResult.isKeyValuesValid) {
    response.errorCodes.push(8);
  } else if (!isUserIdValid) {
    response.errorCodes.push(6);
  } else if (!utils.hasRequiredFields(requiredFields, holon)) {
    response.errorCodes.push(9);
  } else response.result = true;
  return response;
}
