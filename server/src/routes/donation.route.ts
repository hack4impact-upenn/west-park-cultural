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

router.get('/type/:type', getAllDonationsOfType);

router.get('/:id', getDonation);

router.get('/donor/:id', getDonationsByDonorId);

// router.post('/new', isAuthenticated, createNewDonation);
// For testing:
router.post('/new', createNewDonation);


router.put('/acknowledge/:id', acknowledgeDonationById);
// router.post('/edit', isAuthenticated, editDonation);
router.post('/edit', editDonation);

// router.post('/delete', isAuthenticated, deleteDonation);
router.post('/delete', deleteDonation);

export default router;
