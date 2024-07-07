import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';

import {
  getAllDonorsController,
  getAllDonorsOfType,
  createDonorController,
  getDonorByIdController,
  editDonor,
  updateDonorNote,
  updateDonorRecentDonation,
} from '../controllers/donor.controller';

const router = express.Router();

router.get('/all', getAllDonorsController);

router.get('type/:type', isAuthenticated, getAllDonorsOfType);

router.get('/id/:id', isAuthenticated, getDonorByIdController);

router.post('/edit', isAuthenticated, editDonor);

router.post('/updateRecent', isAuthenticated, updateDonorRecentDonation);

router.post('/create', isAuthenticated, createDonorController);

router.post('/note', isAuthenticated, updateDonorNote);

export default router;
