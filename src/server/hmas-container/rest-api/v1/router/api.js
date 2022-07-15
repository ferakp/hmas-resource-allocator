import express from 'express';
import * as handlers from '../handlers/status';

const router = express.Router();
router.get("/status", handlers.getStatus);