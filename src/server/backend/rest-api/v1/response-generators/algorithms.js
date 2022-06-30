const template = {
    links: {
      self: "",
    },
  
    data: [],
  
    errors: [],
  
    actions: [],
  };
  
  export function getAlgorithms(parameters) {
    return commonResponseGenerator(parameters);
  }
  
  export function deleteAlgorithm(parameters) {
    return commonResponseGenerator(parameters);
  }
  
  export function patchAlgorithm(parameters) {
    return commonResponseGenerator(parameters);
  }
  
  export function postAlgorithm(parameters) {
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
          type: "tasks",
          id: user.id,
          attributes: user,
        });
      });
    }
  
    return response;
  }
  