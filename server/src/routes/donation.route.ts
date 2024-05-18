import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';

import {
  getAllDonations,
  getAllDonationsOfType,
  getDonation,
  getDonationsByDonorId,
  createNewDonation,
  editDonation,
  acknowledgeDonationById,
  deleteDonation,
} from '../controllers/donation.controller';

const router = express.Router();

router.get('/all', isAuthenticated, getAllDonations);

router.get('/type/:type', isAuthenticated, getAllDonationsOfType);

router.get('/:id', isAuthenticated, getDonation);

router.get('/donor/:id', isAuthenticated, getDonationsByDonorId);

// router.post('/new', isAuthenticated, createNewDonation);
// For testing:
router.post('/new', isAuthenticated, createNewDonation);

// router.post('/edit', isAuthenticated, editDonation);
router.post('/edit', isAuthenticated, editDonation);

router.put('/acknowledge/:id', isAuthenticated, acknowledgeDonationById);

router.post('/delete', isAuthenticated, deleteDonation);

export default router;