import express from 'express';
import { isAdmin } from '../controllers/admin.middleware';

import {
  getAllDonorsController,
  getAllDonorsOfType,
  createDonorController,
  getDonorByIdController,
} from '../controllers/donor.controller';

const router = express.Router();

router.get('/all', isAdmin, getAllDonorsController);

router.get('/:type', isAdmin, getAllDonorsOfType);

router.get('/:id', isAdmin, getDonorByIdController);

router.post('/create', isAdmin, createDonorController);

export default router;
