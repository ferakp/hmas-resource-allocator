import express from 'express';
import checkAuth from '../middlewares/authentication/checkAuth';
import * as handlers from '../handlers/settingsHandlers';
import * as checkReqValid from '../middlewares/request-validators/settings';
import * as checkPrivValid from '../middlewares/privilege-validators/settings';

const router = express.Router();

router.get('/', checkAuth, checkReqValid.getSettings, checkPrivValid.getSettings, handlers.getSettings);
router.post('/', checkAuth, checkReqValid.postSettings, checkPrivValid.postSettings, handlers.postSettings);

router.get("/:id", checkAuth, checkReqValid.getSettings, checkPrivValid.getSettings, handlers.getSettings);
router.delete("/:id", checkAuth,checkReqValid.deleteSettings, checkPrivValid.deleteSettings, handlers.deleteSettings);
router.patch("/:id", checkAuth, checkReqValid.patchSettings, checkPrivValid.patchSettings, handlers.patchSettings);


export default router;