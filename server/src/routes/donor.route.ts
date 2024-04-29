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

router.get('/:id', isAuthenticated, getDonorByIdController);

router.get('type/:type', isAuthenticated, getAllDonorsOfType);

router.post('/create', isAuthenticated, createDonorController);

export default router;
