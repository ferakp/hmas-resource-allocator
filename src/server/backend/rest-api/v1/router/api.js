import express from 'express';
const router = express.Router();

// Routes
import authRoutes from './auth';
import holonsRoutes from './holons';
import statusRoutes from './status';
import allocationsRoutes from './allocations';
import tasksRoutes from './tasks';
import usersRoutes from './users';
import algorithmsRoutes from './algorithms';
import nliRoutes from './nli';
import kgRoutes from './kg';
import settingsRoutes from './settings';
import messagesRoutes from './messages';

router.use('/auth', authRoutes);
router.use('/holons', holonsRoutes);
router.use('/status', statusRoutes);
router.use('/allocations', allocationsRoutes);
router.use('/tasks', tasksRoutes);
router.use('/users', usersRoutes);
router.use('/algorithms', algorithmsRoutes);
router.use('/nli', nliRoutes);
router.use('/kg', kgRoutes);
router.use('/settings', settingsRoutes);
router.use('/messages', messagesRoutes);

export default router;