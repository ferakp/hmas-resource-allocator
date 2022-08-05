import * as utils from '../utils/utils';

const template = {
  links: {
    self: '',
  },
  data: [],
  errors: [],
};

export function status(parameters) {
  const { req, res, errors = [], actions = [], results = [] } = parameters;
  let response = JSON.parse(JSON.stringify(template));
  const pathname = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`).pathname;
  response.links.self = `${req.protocol}://${req.get('host')}${pathname}`;

  // Response for errors
  if (errors.length > 0) {
    response.errors = response.errors.concat(errors);
  }

  if (results.length > 0) {
    response.data.push({
      type: 'status',
      attributes: results[0],
    });
  }

  return response;
}
