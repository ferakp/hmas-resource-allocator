import express from 'express';
import checkAuth from '../middlewares/authentication/checkAuth';
import * as handlers from '../handlers/searchHandlers';
import * as checkReqValid from '../middlewares/request-validators/search';

const router = express.Router();

router.post('/', checkAuth, checkReqValid.postSearch, handlers.postSearch);

export default router;