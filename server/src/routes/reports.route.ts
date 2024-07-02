import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';

import {
    getAllReportsController,
    createReportsController,
} from '../controllers/reports.controller';

const router = express.Router();

router.get('/all', getAllReportsController);

router.post('/create', isAuthenticated, createReportsController); //overwrite existing if same day

export default router;
