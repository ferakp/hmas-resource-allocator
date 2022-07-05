import * as utils from '../../utils/utils';
import * as errorMessages from '../../messages/errors';
import * as responseGenerators from '../../response-generators/search';
import * as requestConstraints from '../../request-constraints/search';

const allFieldNames = requestConstraints.allFieldNames;
const allFieldConstraints = requestConstraints.allFieldConstraints;

export function postSearch(req, res, next) {
  const reqParams = JSON.parse(JSON.stringify(req.body));
  const acceptedFieldNames = requestConstraints.postSearch.acceptedFieldNames;
  const requiredFieldNames = requestConstraints.postSearch.requiredFieldNames;
  const requiredValues = requestConstraints.postSearch.acceptedFieldValues;

  const errors = utils.postRequestValidationCheck({
    reqParams,
    acceptedFieldNames,
    allFieldConstraints,
    allFieldNames,
    requiredFieldNames,
  });

  // Check values of types
  if (errors.length === 0) {
    if (!requiredValues[0].includes(reqParams.type) || !requiredValues[1].includes(reqParams.resource) || reqParams.ids.length < 1) {
      errors.push(errorMessages.INVALID_PARAMETER_VALUES);
    }
  }

  // Return if error has occured
  if (errors.length > 0) {
    const response = responseGenerators.postSearch({ req, res, errors });
    res.status(response.errors[0].status);
    res.json(response);
    return;
  }

  // Pass
  next();
}
