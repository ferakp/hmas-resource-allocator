/**
 *
 * @param {string} tableName
 * @param {"*" or array} tableColumns name of columns to be selected
 * @param {object} queryObject object whose properties are conditions
 * @param {string} operator logical operator for WHERE clause
 * @returns
 */
export function generateSelectQuery(tableName, tableColumns, queryObject, operator) {
  let queryBase = "SELECT ";
  if (tableColumns === "*") queryBase += "* ";
  else if (Array.isArray(tableColumns)) queryBase += tableColumns.join(",");
  queryBase += " FROM " + tableName;

  if (!queryObject) {
    return { query: queryBase, values: [] };
  } else {
    queryBase += " WHERE ";
  }

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
