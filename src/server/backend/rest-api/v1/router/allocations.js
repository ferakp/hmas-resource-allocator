import express from 'express';
import checkAuth from '../middlewares/authentication/checkAuth';
import * as handlers from '../handlers/allocationsHandlers';
import * as checkReqValid from '../middlewares/request-validators/allocations';
import * as checkPrivValid from '../middlewares/privilege-validators/allocations';

const router = express.Router();

router.get('/', checkAuth, checkReqValid.getAllocations, checkPrivValid.getAllocations, handlers.getAllocations);
router.get('/:id', checkAuth, checkReqValid.getAllocations, checkPrivValid.getAllocations, handlers.getAllocations);

router.post('/', checkAuth, checkReqValid.postAllocation, checkPrivValid.postAllocation, handlers.postAllocation);

router.delete('/:id', checkAuth, checkReqValid.deleteAllocation, checkPrivValid.deleteAllocation, handlers.deleteAllocation);
router.patch('/:id', checkAuth, checkReqValid.patchAllocation, checkPrivValid.patchAllocation, handlers.patchAllocation);

router.post('/:id/complete-request', checkAuth, checkReqValid.postAllocationCompleteRequests, checkPrivValid.postAllocationCompleteRequests, handlers.postAllocationCompleteRequests);

export default router;
