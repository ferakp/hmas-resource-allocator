import express from 'express';
import checkAuth from '../middlewares/authentication/checkAuth';
import * as handlers from '../handlers/messagesHandlers';
import * as checkReqValid from '../middlewares/request-validators/messages';
import * as checkPrivValid from '../middlewares/privilege-validators/messages';

const router = express.Router();

router.post('/', checkAuth, checkReqValid.postMessage, checkPrivValid.postMessage, handlers.postMessage);


export default router;