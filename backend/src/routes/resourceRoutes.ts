import { Router } from 'express';
import { createResource, getAllResources } from '../controllers/resourceController.js';
import { protect, authorizeAdmin } from '../middlewares/auth.js';

const router = Router();

// Public route to view resources
router.get('/', getAllResources);

// Protected Admin route to create resource
router.post('/', protect, authorizeAdmin, createResource);

export default router;