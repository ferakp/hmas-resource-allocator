import * as rDatabaseApi from "../../../relational-database/api";

export async function getHolons(req, res) {
  let filters = req.query;
  if (req.params.holonId) filters.id = req.params.holonId;

  const { errorCodes, dbErrorMessage, results } = await rDatabaseApi.getHolons(
    req.user.userId,
    filters
  );
  console.log(errorCodes, results);
  res.sendStatus(200);
}

export async function createHolon(req, res) {
  let newHolon = req.body.holon;
  const { errorCodes, dbErrorMessage, results } = await rDatabaseApi.createHolon(req.user.userId, newHolon);
  console.log(errorCodes, dbErrorMessage, results);
  res.sendStatus(200);
}

export async function editHolon(req, res) {
  let modifiedHolon = req.body.holon;

  const { err, holon } = await rDatabaseApi.editHolon(req.user.userId, modifiedHolon);
  res.json(holon);
}

export async function deleteHolon(req, res) {
  let deletedHolonId = req.params.holonId;

  const { err, holonId } = await rDatabaseApi.deleteHolon(req.user.userId, deletedHolonId);
  res.json(holonId);
}
