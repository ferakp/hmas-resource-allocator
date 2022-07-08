import * as queryGeneratorUtil from '../utils/queryGenerator';
import * as utils from '../utils/utils';

/**
 * Query generator for retrieving settings
 * @param {object} parameters has properties isForAuth, requester, filters
 * @returns {object} {query, values}
 */
export function getSettings(parameters) {
  const { isForAuth, requester, filters } = parameters;
  let response = { query: null, values: null };

  // Query for retrieving settings by id
  if (isForAuth) {
    response.query = 'SELECT * FROM dashboard_settings WHERE id=$1';
    response.values = [filters.id];
    return response;
  }

  // Query for requesting all settings with and without filters
  if (requester) {
    const selectResponse = queryGeneratorUtil.generateSelectQuery('dashboard_settings', '*', filters, 'AND');

    const query =
      'SELECT users.id, users.role, s.id AS sid, s.settings AS ssettings, s.created_on AS screated_on, s.updated_on AS supdated_on, s.created_by AS screated_by FROM (' +
      selectResponse.query +
      ') AS s FULL OUTER JOIN users ON users.id = s.created_by WHERE s.settings IS NOT NULL';
    const values = selectResponse.values;

    let queryResponse;

    // Query constraint for user WHERE dashboard_settings.settings IS NOT NULL
    if (requester.role === 'user') {
      queryResponse = addUserConstraint(query, values, requester);
    }

    // Query constraint for moderator
    if (requester.role === 'moderator') {
      queryResponse = addModeratorConstraint(query, values, requester);
    }

    // Query constraint for admin
    if (requester.role === 'admin') {
      queryResponse = addAdminConstraint(query, values, requester);
    }

    const wrapper = { query, values };
    wrapper.query =
      'SELECT t.sid AS id, t.ssettings AS settings, t.screated_on AS created_on, t.supdated_on AS updated_on, t.screated_by AS created_by FROM (' +
      queryResponse.query +
      ') AS t';
    wrapper.values = queryResponse.values;

    response.query = wrapper?.query;
    response.values = wrapper?.values;
    return response;
  }

  return response;
}

/**
 * Query generator for editing settings
 * @param {object} parameters has properties requester and reqParams
 * @returns {object} {query, values}
 */
export function editSettings(parameters) {
  const { requester, reqParams } = parameters;
  let response = { query: null, values: null };
  if (!utils.hasFieldsWithValue(reqParams, ['id']) || Object.keys(reqParams).length === 1) return response;
  return queryGeneratorUtil.generateUpdateQuery('dashboard_settings', reqParams, ['id']);
}

/**
 * Query generator for deleting settings
 * @param {object} parameters has properties requester and reqParams
 * @returns {object} {query, values}
 */
export function deleteSettings(parameters) {
  let response = { query: null, values: null };
  if (!utils.hasFieldsWithValue(parameters.reqParams, ['id'])) return response;
  response.query = 'DELETE FROM dashboard_settings WHERE id=$1 RETURNING id';
  response.values = [parameters.reqParams?.id];
  return response;
}

/**
 * Query generator for creating settings
 * @param {object} parameters has property reqParams
 * @returns {object} {query, values}
 */
export function createSettings(parameters) {
  const { reqParams } = parameters;
  let response = { query: null, values: null };
  if (reqParams && reqParams.hasOwnProperty('id') && Object.keys(reqParams).length > 1) return response;

  return queryGeneratorUtil.generateInsertQuery('dashboard_settings', reqParams);
}

/**
 * UTILITY FUNCTIONS
 */

/**
 * ONLY FOR SELECT QUERY
 * Wraps a select query with another query which limits results
 * Accept only those results whose id is same as the requester's id
 * @param {string} query existing query
 * @param {array} values existing query values
 * @param {object} requester requester
 * @returns {object} {query, values}
 */
function addUserConstraint(query, values = [], requester) {
  let finalQuery = 'SELECT * FROM (' + query + ') users WHERE id=$' + (values.length + 1);
  values.push(requester.id);

  return { query: finalQuery, values };
}

/**
 * ONLY FOR SELECT QUERY
 * Wraps a select query with another query which limits results
 * Accept only those results whose role is user or id same as the requester's id
 * @param {string} query existing query
 * @param {array} values existing query values
 * @param {object} requester requester
 * @returns {object} {query, values}
 */
function addModeratorConstraint(query, values = [], requester) {
  let finalQuery = 'SELECT * FROM (' + query + ') users WHERE (id=$' + (values.length + 1) + ' OR role=$' + (values.length + 2) + ')';
  values = values.concat([requester.id, 'user']);
  return { query: finalQuery, values };
}

/**
 * ONLY FOR SELECT QUERY
 * Wraps a select query with another query which limits results
 * Accept only those results whose role is (user or moderator) or whose id same as the requester's id
 * @param {string} query existing query
 * @param {array} values existing query values
 * @param {object} requester requester
 * @returns {object} {query, values}
 */
function addAdminConstraint(query, values = [], requester) {
  let finalQuery = 'SELECT * FROM (' + query + ') users WHERE (id=$' + (values.length + 1) + ' OR role=$' + (values.length + 2) + ' OR role=$' + (values.length + 3) + ')';
  values = values.concat([requester.id, 'user', 'moderator']);
  return { query: finalQuery, values };
}
