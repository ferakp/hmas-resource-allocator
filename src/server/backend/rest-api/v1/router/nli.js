import express from 'express';
import checkAuth from '../middlewares/authentication/checkAuth';
import * as handlers from '../handlers/nliHandlers';
import * as checkReqValid from '../middlewares/request-validators/nli';
import * as checkPrivValid from '../middlewares/privilege-validators/nli';

const router = express.Router();

router.get('/', checkAuth, checkReqValid.getNli, checkPrivValid.getNli, handlers.getNli);
router.post('/', checkAuth, checkReqValid.postNli, checkPrivValid.postNli, handlers.postNli);

export default router;