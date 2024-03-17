import express from 'express';
import { isAdmin } from '../controllers/admin.middleware';

import {
  getAllDonations,
  getAllDonationsOfType,
  getDonation,
  getDonationsByDonorId,
  createNewDonation,
  acknowledgeDonationById,
} from '../controllers/donation.controller';

const router = express.Router();

router.get('/all', isAdmin, getAllDonations);

router.get('/type/:type', isAdmin, getAllDonationsOfType);

router.get('/:id', isAdmin, getDonation);

router.get('/donor/:donorId', isAdmin, getDonationsByDonorId);

router.post('/new', createNewDonation);

router.put('/acknowledge/:id', isAdmin, acknowledgeDonationById);

export default router;
