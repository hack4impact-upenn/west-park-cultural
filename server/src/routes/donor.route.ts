import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';

import {
  getAllDonorsController,
  getAllDonorsOfType,
  createDonorController,
  getDonorByIdController,
} from '../controllers/donor.controller';

const router = express.Router();

router.get('/all', isAuthenticated, getAllDonorsController);

// edited this to avoid conflict with /:id
router.get('/type/:type', isAuthenticated, getAllDonorsOfType);

// router.get('/id/:id', isAuthenticated, getDonorByIdController);
// for testing:
router.get('/id/:id', getDonorByIdController);

router.post('/create', isAuthenticated, createDonorController);

export default router;
