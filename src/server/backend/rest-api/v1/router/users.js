import express from 'express';
import checkAuth from '../middlewares/authentication/checkAuth';
import * as handlers from '../handlers/usersHandlers';
import * as checkReqValid from '../middlewares/request-validators/users';
import * as checkPrivValid from '../middlewares/privilege-validators/users';

const router = express.Router();

router.get('/', checkAuth, checkReqValid.getUsers, handlers.getUsers);
router.post('/', checkAuth, checkReqValid.postUser, checkPrivValid.postUser, handlers.postUser);

router.get("/:id", checkAuth, checkReqValid.getUsers, checkPrivValid.getUsers, handlers.getUsers);
router.delete("/:id", checkAuth, checkPrivValid.deleteUser, handlers.deleteUser);
router.patch("/:id", checkAuth, checkReqValid.patchUser, checkPrivValid.patchUser, handlers.patchUser);


export default router;