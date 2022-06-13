import * as utils from "../utils/utils";

const template = {
  links: {
    self: "",
  },

  data: [],

  errors: [],

  actions: []
};

export function checkAuth(parameters) {
  const { req, res, errors = [], actions = [] } = parameters;
  let response = JSON.parse(JSON.stringify(template));
  const pathname = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`).pathname;
  response.links.self = `${req.protocol}://${req.get("host")}${pathname}`;

  // Response for errors
  if (errors.length > 0) {
    response.errors = errors;
  }

  // Response for actions
  if(actions.length > 0) {
    response.actions = actions;
  }

  return response;
}
