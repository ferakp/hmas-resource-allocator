import express from 'express';
import checkAuth from '../middlewares/authentication/checkAuth';
import * as handlers from '../handlers/algorithmsHandlers';
import * as checkReqValid from '../middlewares/request-validators/algorithms';
import * as checkPrivValid from '../middlewares/privilege-validators/algorithms';

const router = express.Router();

router.get('/', checkAuth, checkReqValid.getAlgorithms, checkPrivValid.getAlgorithms, handlers.getAlgorithms);
router.post('/', checkAuth, checkReqValid.postAlgorithm, checkPrivValid.postAlgorithm, handlers.postAlgorithm);

router.get("/:id", checkAuth, checkReqValid.getAlgorithms, checkPrivValid.getAlgorithms, handlers.getAlgorithms);
router.delete("/:id", checkAuth,checkReqValid.deleteAlgorithm, checkPrivValid.deleteAlgorithm, handlers.deleteAlgorithm);
router.patch("/:id", checkAuth, checkReqValid.patchAlgorithm, checkPrivValid.patchAlgorithm, handlers.patchAlgorithm);


export default router;