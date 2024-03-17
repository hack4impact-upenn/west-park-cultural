import { Router } from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';
import { isAdmin } from '../controllers/admin.middleware';
import {
  getAllDonations,
  getDonation,
  getDonorDonation,
} from '../controllers/donation.controller';

const donationRouter = Router();

/**
 * A GET route to get all donations.
 */
 donationRouter.get('/all', isAuthenticated, isAdmin, getAllDonations);

/**
 * A GET route with specific school id
 * id (string) - The school id of the particular school
 */
 donationRouter.get('/:id', isAuthenticated, getDonation);

 donationRouter.get('/donor/:id', isAuthenticated, getDonorDonation);

/**
 * A POST route to create a school.
 */
// schoolRouter.post('/create', isAuthenticated, isAdmin, createSchool);

/**
 * A PUT route to delete a school.
 */
// schoolRouter.put('/delete', isAuthenticated, isAdmin, deleteSchool);

/**
 * A PUT route to update a school.
 */
// schoolRouter.put('/update', isAuthenticated, isAdmin, updateSchool);

export default donationRouter;