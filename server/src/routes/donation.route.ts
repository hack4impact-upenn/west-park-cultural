import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';

import {
  getAllDonations,
  getAllDonationsOfType,
  getDonation,
  getDonationsByDonorId,
  createNewDonation,
  acknowledgeDonationById,
} from '../controllers/donation.controller';

const router = express.Router();

router.get('/all', isAuthenticated, getAllDonations);

router.get('/type/:type', isAuthenticated, getAllDonationsOfType);

router.get('/:id', isAuthenticated, getDonation);

router.get('/donor/:donorId', isAuthenticated, getDonationsByDonorId);

router.post('/new', createNewDonation);

router.put('/acknowledge/:id', isAuthenticated, acknowledgeDonationById);

export default router;
