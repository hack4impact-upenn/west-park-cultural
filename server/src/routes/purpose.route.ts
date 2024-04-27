import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';

import {
  createPurposeController,
  getPurposeByIdController,
  getAllPurposesController,
} from '../controllers/purpose.controller';

const router = express.Router();

// router.post('/', isAuthenticated, createPurposeController);
// For testing:
router.post('/', createPurposeController);

// router.get('/:id', isAuthenticated, getPurposeByIdController);
router.get('/:id', getPurposeByIdController);

router.get('/', getAllPurposesController);

export default router;
