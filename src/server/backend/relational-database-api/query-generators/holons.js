import * as errorMessages from '../../rest-api/v1/messages/errors';
import * as utils from '../utils/utils';
import * as queryGeneratorUtil from '../utils/queryGenerator';

export function getHolons(parameters) {
  const { filters } = parameters;
  let response = { query: null, values: null };
  const { query, values } = queryGeneratorUtil.generateSelectQuery('holons', '*', filters, 'AND');
  response.query = query;
  response.values = values;
  return response;
}

export function createHolon(parameters) {
  const { reqParams } = parameters;
  let response = { query: null, values: null };
  const { query, values } = queryGeneratorUtil.generateInsertQuery('holons', reqParams);
  response.query = query;
  response.values = values;
  return response;
}

export function deleteHolon(parameters) {
  let response = { query: null, values: null };
  if (!utils.hasFieldsWithValue(parameters.reqParams, ['id'])) return response;
  response.query = 'DELETE FROM holons WHERE id=$1 RETURNING id';
  response.values = [parameters.reqParams?.id];
  return response;
}

export function editHolon(parameters) {
  let response = { query: null, values: null };
  if (!utils.hasFieldsWithValue(parameters.reqParams, ['id']) || Object.keys(parameters.reqParams).length < 2) return response;
  return queryGeneratorUtil.generateUpdateQuery('holons', parameters.reqParams, ['id']);
}
