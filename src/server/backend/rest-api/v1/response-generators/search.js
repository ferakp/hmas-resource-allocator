const template = {
  links: {
    self: '',
  },

  data: [],

  errors: [],

  actions: [],
};

export function postSearch(parameters) {
  return commonResponseGenerator(parameters);
}

function commonResponseGenerator(parameters) {
  const { req, res, errors = [], actions = [], results = [], reqParams } = parameters;
  let response = JSON.parse(JSON.stringify(template));
  const pathname = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`).pathname;
  response.links.self = `${req.protocol}://${req.get('host')}${pathname}`;

  // Response for errors
  if (errors.length > 0) {
    response.errors = errors;
  }

  // Response for actions
  if (actions.length > 0) {
    response.actions = actions;
  }

  // Response for results
  if (errors.length === 0 && reqParams.type === 'bulk-search' && results.length > 0) {
    results.forEach((data) => {
      response.data.push({
        type: reqParams.resource,
        id: data.id,
        attributes: data,
      });
    });
  }

  if (errors.length === 0 && reqParams.type === 'bulk-update-check') {
    if (results.length !== 0)
      response.data.push({
        type: reqParams.type,
        id: 1,
        attributes: results,
      });
  }

  return response;
}
