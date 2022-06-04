import express from 'express';
import checkAuth from '../middlewares/authentication/checkAuth';
import * as statusHandlers from '../handlers/statusHandlers';

const router = express.Router();

router.get('/', statusHandlers.status);

export default router;