import * as core from '../../../core/core';

export function getStatus(req, res) {
  const response = generateStatusResponse({req, res, object: core.serverStatus});
  res.status(200);
  res.json(response);
}

/**
 * getStatus RESPONSE GENERATOR
 */

const template = {
  links: {
    self: '',
  },
  data: [],
  errors: [],
};

export function generateStatusResponse(parameters) {
  return commonResponseGenerator(parameters);
}

function commonResponseGenerator(parameters) {
  const { req, res, errors = [], object } = parameters;
  let response = JSON.parse(JSON.stringify(template));
  const pathname = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`).pathname;
  response.links.self = `${req.protocol}://${req.get('host')}${pathname}`;

  // Response for errors
  if (errors.length > 0) {
    response.errors = errors;
  }

  // Response for /status
  if (object) {
    response.data.push({
      type: 'status',
      attributes: object,
    });
  }

  return response;
}
