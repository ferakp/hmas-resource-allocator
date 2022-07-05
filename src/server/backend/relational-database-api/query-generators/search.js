import * as errorMessages from '../../rest-api/v1/messages/errors';
import * as utils from '../utils/utils';
import * as queryGeneratorUtil from '../utils/queryGenerator';

export function search(parameters) {
  const { requester, reqParams } = parameters;
  let response = { query: null, values: null };
  if (!utils.hasFieldsWithValue(parameters.reqParams, ['type', 'resource', 'ids']) || Object.keys(parameters.reqParams).length < 3) return response;
  if (!['bulk-search', 'bulk-update-check'].includes(reqParams.type)) return response;

  let idsClause = [];
  let values = [];

  let queryBase = 'SELECT ';
  if (reqParams.resource === 'users') queryBase += 'id, role, username, firstname, lastname, email, created_on, last_login, updated_on ';
  else queryBase += '* ';

  reqParams.ids.forEach((e, i) => {
    idsClause.push('id=$' + (i + 1));
    values.push(e);
  });

  queryBase += 'FROM ' + reqParams.resource;
  queryBase += ' WHERE (' + idsClause.join(' OR ') + ')';

  response.query = queryBase;
  response.values = values;

  return response;
}
