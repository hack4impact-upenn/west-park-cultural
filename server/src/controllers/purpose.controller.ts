/* eslint-disable consistent-return */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { IPurpose } from '../models/purpose.model';

import {
  createPurpose,
  getPurposeById,
  getAllPurposes,
} from '../services/purpose.service';

const createPurposeController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const purpose: IPurpose = req.body;
  return createPurpose(purpose)
    .then((result: any) => {
      res.status(StatusCode.CREATED).send(result);
    })
    .catch(() => {
      next(ApiError.internal('Unable to create purpose'));
    });
};

const getPurposeByIdController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  return getPurposeById(id)
    .then((purpose: unknown) => {
      res.status(StatusCode.OK).send(purpose);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve purpose'));
    });
};

const getAllPurposesController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return getAllPurposes()
    .then((purposeList: any) => {
      res.status(StatusCode.OK).send(purposeList);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve all purposes'));
    });
};

export {
  createPurposeController,
  getPurposeByIdController,
  getAllPurposesController,
};
