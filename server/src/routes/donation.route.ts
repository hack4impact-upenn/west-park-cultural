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

router.get('/all', getAllDonations);

router.get('/type/:type', isAuthenticated, getAllDonationsOfType);

router.get('/:id', getDonation);

router.get('/donor/:id', isAuthenticated, getDonationsByDonorId);

// router.post('/new', isAuthenticated, createNewDonation);
// For testing:
router.post('/new', createNewDonation);

// router.post('/edit', isAuthenticated, editDonation);
router.post('/edit', editDonation);

router.put('/acknowledge/:id', isAuthenticated, acknowledgeDonationById);

// router.post('/delete', isAuthenticated, deleteDonation);
router.post('/delete', deleteDonation);

export default router;
