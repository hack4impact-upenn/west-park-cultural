import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';

import {
  getAllDonorsController,
  getAllDonorsOfType,
  createDonorController,
  getDonorByIdController,
} from '../controllers/donor.controller';

const router = express.Router();

router.get('/all', getAllDonorsController);

router.get('/:type', isAuthenticated, getAllDonorsOfType);

router.get('/:id', isAuthenticated, getDonorByIdController);

// router.post('/create', isAuthenticated, createDonorController);
// For testing:
router.post('/create', createDonorController);

export default router;
