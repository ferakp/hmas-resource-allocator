import express from 'express';
import checkAuth from '../middlewares/authentication/checkAuth';
import * as handlers from '../handlers/kgHandlers';
import * as checkReqValid from '../middlewares/request-validators/kg';
import * as checkPrivValid from '../middlewares/privilege-validators/kg';

const router = express.Router();

router.get('/', checkAuth, checkReqValid.getKg, checkPrivValid.getKg, handlers.getKg);
router.post('/', checkAuth, checkReqValid.postKg, checkPrivValid.postKg, handlers.postKg);

router.get("/:id", checkAuth, checkReqValid.getKg, checkPrivValid.getKg, handlers.getKg);
router.delete("/:id", checkAuth,checkReqValid.deleteKg, checkPrivValid.deleteKg, handlers.deleteKg);
router.patch("/:id", checkAuth, checkReqValid.patchKg, checkPrivValid.patchKg, handlers.patchKg);


export default router;