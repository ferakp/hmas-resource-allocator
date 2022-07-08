import * as utils from '../utils/utils';
import * as queryGeneratorUtil from '../utils/queryGenerator';

export function getAlgorithms(parameters) {
  const { filters } = parameters;
  let response = { query: null, values: null };
  const { query, values } = queryGeneratorUtil.generateSelectQuery('algorithms', '*', filters, 'AND');
  response.query = query;
  response.values = values;
  return response;
}

export function createAlgorithm(parameters) {
  const { reqParams } = parameters;
  let response = { query: null, values: null };
  const { query, values } = queryGeneratorUtil.generateInsertQuery('algorithms', reqParams);
  response.query = query;
  response.values = values;
  return response;
}

export function deleteAlgorithm(parameters) {
  let response = { query: null, values: null };
  if (!utils.hasFieldsWithValue(parameters.reqParams, ['id'])) return response;
  response.query = 'DELETE FROM algorithms WHERE id=$1 RETURNING id';
  response.values = [parameters.reqParams?.id];
  return response;
}

export function editAlgorithm(parameters) {
  let response = { query: null, values: null };
  if (!utils.hasFieldsWithValue(parameters.reqParams, ['id']) || Object.keys(parameters.reqParams).length < 2) return response;
  return queryGeneratorUtil.generateUpdateQuery('algorithms', parameters.reqParams, ['id']);
}
