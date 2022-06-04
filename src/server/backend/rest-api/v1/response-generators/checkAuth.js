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
  const { req, res, errorCodes = [], actionCodes = [] } = parameters;
  let response = structuredClone(template);

  response.links.self = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

  // Response for errors
  if (errorCodes.length > 0) {
    response.errors = response.errors.concat(utils.getErrorMessagesByCodes(errorCodes));
  }

  // Response for actions
  if(actionCodes.length > 0) {
    response.actions = response.actions.concat(utils.getActionsByCodes(actionCodes));
  }

  return response;
}
