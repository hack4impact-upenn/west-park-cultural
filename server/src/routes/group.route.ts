import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';

import {
  createCommunicationGroupController,
  getCommunicationGroupByIdController,
  getAllGroupsController,
} from '../controllers/group.controller';

const router = express.Router();

router.get('/all', getAllGroupsController);

router.post('/', isAuthenticated, createCommunicationGroupController);

router.get('/:id', isAuthenticated, getCommunicationGroupByIdController);

export default router;
