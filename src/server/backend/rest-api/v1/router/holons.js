import express from 'express';
import checkAuth from '../middlewares/authentication/checkAuth';
import * as holonsHandlers from '../handlers/holonsHandlers';

const router = express.Router();

router.get("/", checkAuth, holonsHandlers.getHolons);
router.post("/", checkAuth, holonsHandlers.createHolon);

router.get("/:holonId", checkAuth, holonsHandlers.getHolons);
router.delete("/:holonId", checkAuth, holonsHandlers.deleteHolon);
router.patch("/:holonId", checkAuth, holonsHandlers.editHolon);

export default router;