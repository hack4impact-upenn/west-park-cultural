import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';
import {
  createCommunicationController,
  getCommunicationByIdController,
  getAllCommunicationsController,
} from '../controllers/communication.controller';

const router = express.Router();

router.post('/', isAuthenticated, createCommunicationController);

router.get('/:id', isAuthenticated, getCommunicationByIdController);

router.get('/', isAuthenticated, getAllCommunicationsController);

export default router;
