import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';

import {
  createCommunicationGroupController,
  getCommunicationGroupByIdController,
} from '../controllers/group.controller';

const router = express.Router();

router.post('/', isAuthenticated, createCommunicationGroupController);

router.get('/:id', isAuthenticated, getCommunicationGroupByIdController);

export default router;
