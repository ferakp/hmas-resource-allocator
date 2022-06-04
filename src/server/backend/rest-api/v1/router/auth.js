import express from 'express';
import checkAuth from '../middlewares/authentication/checkAuth';
import * as authHandlers from '../handlers/authHandlers';
import * as validator from '../middlewares/request-validators/auth';

const router = express.Router();

router.get('/login', validator.login, authHandlers.login);
router.get('/refreshtoken', checkAuth, authHandlers.refreshToken);

export default router;