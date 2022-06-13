import express from 'express';
import checkAuth from '../middlewares/authentication/checkAuth';
import * as authHandlers from '../handlers/authHandlers';
import * as reqValid from '../middlewares/request-validators/auth';

const router = express.Router();

router.get('/login', reqValid.login, authHandlers.login);
router.get('/refreshtoken', checkAuth, authHandlers.refreshToken);

export default router;