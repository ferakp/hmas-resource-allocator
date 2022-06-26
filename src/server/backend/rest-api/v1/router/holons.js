import express from "express";
import checkAuth from "../middlewares/authentication/checkAuth";
import * as holonsHandlers from "../handlers/holonsHandlers";
import * as checkReqValid from "../middlewares/request-validators/holons";
import * as checkPrivValid from "../middlewares/privilege-validators/holons";

const router = express.Router();

router.get("/", checkAuth, checkReqValid.getHolons, checkPrivValid.getHolons, holonsHandlers.getHolons);
router.post("/", checkAuth, checkReqValid.postHolon, checkPrivValid.postHolon, holonsHandlers.postHolon);

router.get("/:id", checkAuth, checkReqValid.getHolons, checkPrivValid.getHolons, holonsHandlers.getHolons);
router.delete("/:id", checkAuth, checkReqValid.deleteHolon, checkPrivValid.deleteHolon, holonsHandlers.deleteHolon);
router.patch("/:id", checkAuth, checkReqValid.patchHolon, checkPrivValid.patchHolon, holonsHandlers.patchHolon);

export default router;
