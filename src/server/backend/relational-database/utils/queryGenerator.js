/**
 *
 * @param {string} tableName
 * @param {"*" or array} tableColumns name of columns to be selected
 * @param {object} queryObject object whose properties are conditions
 * @param {string} operator logical operator for WHERE clause
 * @returns
 */
export function generateSelectQuery(tableName, tableColumns, queryObject = {}, operator) {
  if (!tableName || !tableColumns || !operator) return { query: undefined, values: undefined };
  // SELECT
  let queryBase = "SELECT ";

  // Selector [* or column names]
  if (tableColumns === "*") queryBase += "* ";
  else if (Array.isArray(tableColumns)) queryBase += tableColumns.join(",");

  // FROM [table name]
  queryBase += " FROM " + tableName;

  // Check if query has conditions
  if (Object.keys(queryObject).length === 0) {
    return { query: queryBase, values: [] };
  } else {
    queryBase += " WHERE ";
  }

  // Generate WHERE clause conditions
  let conditions = [];
  let values = [];
  Object.keys(queryObject).map((conditionName, i) => {
    let condition = conditionName.split(".")[0];
    conditionName.split(".").length === 2
      ? (condition += getOperator(conditionName.split(".")[1]))
      : (condition += "=");
    conditions.push(condition + "$" + (i + 1));
    values.push(queryObject[conditionName]);
  });

  return { query: queryBase + conditions.join(" " + operator + " "), values };
}

export function generateUpdateQuery(tableName, queryObject = {}, conditionFieldNames = []) {
  if (Object.keys(queryObject).length < 2 || conditionFieldNames.length === 0 || !tableName)
    return { query: undefined, values: undefined };
  let queryBase = "UPDATE " + tableName;

  // Separate condition fields from updatable fields
  let conditionObject = {};
  conditionFieldNames.forEach((elementName) => {
    conditionObject[elementName] = queryObject[elementName];
    delete queryObject[elementName];
  });

  // Prepare set clause's elements
  let setClauseElements = [];
  Object.keys(queryObject).map((fieldName, index) => {
    setClauseElements.push(fieldName + "=" + "$" + (index + 1));
  });

  // Prepare where clause's elements
  let whereClauseElements = [];
  Object.keys(conditionObject).map((fieldName, index) => {
    whereClauseElements.push(fieldName + "=" + "$" + (setClauseElements.length + index + 1));
  });

  let query =
    queryBase +
    " SET " +
    setClauseElements.join(",") +
    " WHERE " +
    whereClauseElements.join(",") +
    " RETURNING *";
  let values = Object.values(queryObject).concat(Object.values(conditionObject));

  return {
    query: query,
    values: values,
  };
}

export function generateInsertQuery(tableName, queryObject = {}) {
  if (Object.keys(queryObject).length < 2 || !tableName) return { query: undefined, values: undefined };

  let query = "INSERT INTO "+tableName+" (" + Object.keys(queryObject).join(",") + ")";
  let valueClauseElements = [];
  Object.keys(queryObject).map((fieldName, index) => {
    valueClauseElements.push("$" + (index + 1));
  });
  query += " VALUES (" + valueClauseElements.join(",") + ") RETURNING *";

  return {
    query: query,
    values: Object.values(queryObject),
  };
}

export function generateWhereClause(fields, joinWord) {
  let whereClauseElements = [];
  let tempValues = [];
  Object.keys(fields).map((filter, i) => {
    let clause = filter.split(".")[0];
    filter.split(".").length === 2 ? (clause += getOperator(filter.split(".")[1])) : (clause += "=");
    whereClauseElements.push(clause + "$" + (i + 1));
    tempValues.push(fields[filter]);
  });
  return {
    clause: whereClauseElements.join(" " + joinWord + " "),
    values: tempValues,
  };
}

export function getOperator(operatorName) {
  if (operatorName === "e") return "=";
  else if (operatorName === "elt") return "<=";
  else if (operatorName === "egt") return ">=";
  else if (operatorName === "gt") return ">";
  else if (operatorName === "lt") return "<";
}
