import express from 'express';
import checkAuth from '../middlewares/authentication/checkAuth';
import * as usersHandlers from '../handlers/usersHandlers';

const router = express.Router();

router.get('/', checkAuth, usersHandlers.getUsers);
router.post('/', checkAuth, usersHandlers.createUser);

router.get("/:id", checkAuth, usersHandlers.getUsers);
router.delete("/:id", checkAuth, usersHandlers.deleteUser);
router.patch("/:id", checkAuth, usersHandlers.editUser);


export default router;