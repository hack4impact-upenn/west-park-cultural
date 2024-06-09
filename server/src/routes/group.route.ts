import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';

import {
  createCommunicationGroupController,
  getCommunicationGroupByIdController,
  getAllGroupsController,
  editGroupController,
} from '../controllers/group.controller';

const router = express.Router();

router.get('/all', getAllGroupsController);

router.post('/create', isAuthenticated, createCommunicationGroupController);

router.post('/edit', isAuthenticated, editGroupController);

router.get('/:id', isAuthenticated, getCommunicationGroupByIdController);


export default router;
