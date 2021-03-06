const template = {
  links: {
    self: "",
  },

  data: [],

  errors: [],

  actions: [],
};

export function getUsers(parameters) {
  return commonResponseGenerator(parameters);
}

export function deleteUser(parameters) {
  return commonResponseGenerator(parameters);
}

export function patchUser(parameters) {
  return commonResponseGenerator(parameters);
}

export function postUser(parameters) {
  return commonResponseGenerator(parameters);
}

function commonResponseGenerator(parameters) {
  const { req, res, errors = [], actions = [], results = [] } = parameters;
  let response = JSON.parse(JSON.stringify(template));
  const pathname = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`).pathname;
  response.links.self = `${req.protocol}://${req.get("host")}${pathname}`;

  // Response for errors
  if (errors.length > 0) {
    response.errors = errors;
  }

  // Response for actions
  if (actions.length > 0) {
    response.actions = actions;
  }

  // Response for results
  if (results.length > 0) {
    results.forEach((data) => {
      response.data.push({
        type: "users",
        id: data.id,
        attributes: data,
      });
    });
  }

  return response;
}
