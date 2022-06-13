import * as errorMessages from "../messages/errors";
import * as utils from "../utils/utils";

const template = {
  links: {
    self: "",
  },
  data: [],
  errors: [],
};

export function login(parameters) {
  return commonResponseGenerator(parameters);
}

export function refreshToken(parameters) {
  return commonResponseGenerator(parameters);
}

export function status(parameters) {
  const { req, res, errors = [], responses } = parameters;
  let response = JSON.parse(JSON.stringify(template));
  const pathname = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`).pathname;
  response.links.self = `${req.protocol}://${req.get("host")}${pathname}`;

  // Response for errors
  if (errors.length > 0) {
    response.errors = errors;
  }

  // Response for statusObject
  response.data.push({
    type: "status",
    attributes: responses,
  });

  return response;
}

function commonResponseGenerator(parameters) {
  const { req, res, errors = [], token } = parameters;
  let response = JSON.parse(JSON.stringify(template));
  const pathname = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`).pathname;
  response.links.self = `${req.protocol}://${req.get("host")}${pathname}`;

  // Response for errors
  if (errors.length > 0) {
    response.errors = errors;
  }

  // Response for token
  if (token) {
    response.data.push({
      type: "authToken",
      attributes: {
        token: token,
      },
    });
  }

  return response;
}
