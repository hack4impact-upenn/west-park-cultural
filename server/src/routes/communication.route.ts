import express from 'express';
import { isAdmin } from '../controllers/admin.middleware';

import {
  createCommunicationController,
  getCommunicationByIdController,
  getAllCommunicationsController,
} from '../controllers/communication.controller';

const router = express.Router();

router.post('/', isAdmin, createCommunicationController);

router.get('/:id', isAdmin, getCommunicationByIdController);

router.get('/', isAdmin, getAllCommunicationsController);

export default router;
