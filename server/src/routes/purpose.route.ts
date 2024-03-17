import express from 'express';
import { isAdmin } from '../controllers/admin.middleware';

import {
  createPurposeController,
  getPurposeByIdController,
  getAllPurposesController,
} from '../controllers/purpose.controller';

const router = express.Router();

router.post('/', isAdmin, createPurposeController);

router.get('/:id', isAdmin, getPurposeByIdController);

router.get('/', isAdmin, getAllPurposesController);

export default router;
