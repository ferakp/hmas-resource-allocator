import * as utils from "../../utils/utils";
import * as errorMessages from "../../messages/errors";
import * as responseGenerators from "../../response-generators/messages";
import * as requestConstraints from "../../request-constraints/messages";

const allFieldNames = requestConstraints.allFieldNames;
const allFieldConstraints = requestConstraints.allFieldConstraints;

export function getMessages(req, res, next) {
  const errors = [];
  const query = JSON.parse(JSON.stringify(req.query));
  // If path is users/:id
  if (utils.hasFieldWithValue(req.params, "id")) query.id = req.params.id;
  const acceptedFieldNames = requestConstraints.getUsers.acceptedFieldNames;

  // Validator responses
  let hasDuplicateQueryKeys = false;
  let hasCorrectQueryKeys = false;
  let hasCorrectQueryValues = false;

  // Pass
  next();
}

export function deleteMessage(req, res, next) {
    const errors = [];
    const query = JSON.parse(JSON.stringify(req.query));
    // If path is users/:id
    if (utils.hasFieldWithValue(req.params, "id")) query.id = req.params.id;
    const acceptedFieldNames = requestConstraints.deleteUser.acceptedFieldNames;
  
    // Validator responses
    let hasCorrectQueryValues = false;
  
    // Validate query values
    hasCorrectQueryValues = utils.isObjectFieldValuesValid(query, allFieldNames, allFieldConstraints);
  
    if (!hasCorrectQueryValues) {
      res.sendStatus(204);
      return;
    }
  
    // Pass
    next();
  }

  export function postMessage(req, res, next) {
    const errors = [];
    const parameters = JSON.parse(JSON.stringify(req.body));
    const acceptedFieldNames = requestConstraints.postUser.acceptedFieldNames;
  
    // Validator responses
    let hasRequiredParameters = true;
    let hasDuplicateParameters = false;
    let hasCorrectParameterNames = false;
    let hasCorrectParameterValues = false;

    // Pass
    next();
  }