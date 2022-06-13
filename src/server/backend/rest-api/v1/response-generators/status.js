import * as utils from "../utils/utils";

const template = {
  links: {
    self: "",
  },
  data: [],
  errors: [],
};

export function status(parameters) {
  const { req, res, errorCodes = [], responses } = parameters;
  let response = JSON.parse(JSON.stringify(template));
  const pathname = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`).pathname;
  response.links.self = `${req.protocol}://${req.get("host")}${pathname}`;

  // Response for errors
  if (errorCodes.length > 0) {
    response.errors = response.errors.concat(utils.getErrorMessagesByCodes(errorCodes));
  }

  // Response for statusObject
  response.data.push({
    type: "status",
    attributes: responses,
  });

  return response;
}