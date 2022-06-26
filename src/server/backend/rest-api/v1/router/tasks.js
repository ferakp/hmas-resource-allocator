import express from 'express';
import checkAuth from '../middlewares/authentication/checkAuth';
import * as handlers from '../handlers/tasksHandlers';
import * as checkReqValid from '../middlewares/request-validators/tasks';
import * as checkPrivValid from '../middlewares/privilege-validators/tasks';

const router = express.Router();

router.get('/', checkAuth, checkReqValid.getTasks, checkPrivValid.getTasks, handlers.getTasks);
router.post('/', checkAuth, checkReqValid.postTask, checkPrivValid.postTask, handlers.postTask);

router.get("/:id", checkAuth, checkReqValid.getTasks, checkPrivValid.getTasks, handlers.getTasks);
router.delete("/:id", checkAuth, checkReqValid.deleteTask, checkPrivValid.deleteTask, handlers.deleteTask);
router.patch("/:id", checkAuth, checkReqValid.patchTask, checkPrivValid.patchTask, handlers.patchTask);


export default router;