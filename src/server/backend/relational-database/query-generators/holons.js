import * as errorMessages from "../../rest-api/v1/messages/errors";
import * as utils from "../utils/utils";
//import * as validator from "../validators/holons";

export function getHolons(userId, filters) {
  let response = { errorCodes: [], query: null, values: null };

  const validatorResponse = validator.validateGetHolons(userId, filters);
  if (validatorResponse.errorCodes.length > 0) {
    response.errorCodes = validatorResponse.errorCodes;
  } else {
    if (Object.keys(filters).length === 0) response.query = "SELECT * FROM holons";
    else {
      let queryBase = "SELECT * FROM holons WHERE ";
      const { clause, values } = utils.generateWhereClause(filters, "AND");
      response.query = queryBase + clause;
      response.values = values;
    }
  }
  return response;
}

export function createHolon(userId, holon) {
  let response = { errorCodes: [], query: null, values: null };

  const validatorResponse = validator.validateCreateHolon(userId, holon);
  if (validatorResponse.errorCodes.length > 0) {
    response.errorCodes = validatorResponse.errorCodes;
  } else {
    if (!holon.hasOwnProperty("daily_work_hours")) holon["daily_work_hours"] = "0";
    if (!holon.hasOwnProperty("availability_data"))
      holon["availability_data"] = JSON.stringify({ currentValue: 0, latestUpdate: new Date(), records: {} });
    if (!holon.hasOwnProperty("load_data"))
      holon["load_data"] = JSON.stringify({ currentValue: 0, latestUpdate: new Date(), records: {} });
    if (!holon.hasOwnProperty("stress_data"))
      holon["stress_data"] = JSON.stringify({ currentValue: 0, latestUpdate: new Date(), records: {} });
    if (!holon.hasOwnProperty("cost_data"))
      holon["cost_data"] = JSON.stringify({ currentValue: 0, latestUpdate: new Date(), records: {} });
    if (!holon.hasOwnProperty("experience_years")) holon["experience_years"] = "0";
    if (!holon.hasOwnProperty("created_on")) holon["created_on"] = new Date();
    if (!holon.hasOwnProperty("updated_on")) holon["updated_on"] = new Date();
    if (!holon.hasOwnProperty("created_by")) holon["created_by"] = userId;

    const { query, values } = utils.generateInsertQuery("holons", holon);
    console.log(query, values);
    response.query = query;
    response.values = values;
  }
  return response;
}
