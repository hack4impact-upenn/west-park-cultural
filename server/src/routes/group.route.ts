import express from 'express';
import { isAdmin } from '../controllers/admin.middleware';

import {
  createCommunicationGroupController,
  getCommunicationGroupByIdController,
} from '../controllers/group.controller';

const router = express.Router();

router.post('/', isAdmin, createCommunicationGroupController);

router.get('/:id', isAdmin, getCommunicationGroupByIdController);

export default router;
