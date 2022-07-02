const template = {
    links: {
      self: "",
    },
  
    data: [],
  
    errors: [],
  
    actions: [],
  };
  
  export function getSettings(parameters) {
    return commonResponseGenerator(parameters);
  }
  
  export function deleteSettings(parameters) {
    return commonResponseGenerator(parameters);
  }
  
  export function patchSettings(parameters) {
    return commonResponseGenerator(parameters);
  }
  
  export function postSettings(parameters) {
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
      results.forEach((user) => {
        response.data.push({
          type: "settings",
          id: user.id,
          attributes: user,
        });
      });
    }
  
    return response;
  }
  