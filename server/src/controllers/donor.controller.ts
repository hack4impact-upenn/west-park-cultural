/* eslint-disable consistent-return */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { IDonor } from '../models/donor.model';

import {
  getAllDonors,
  getAllDonorsTypeDonor,
  getAllDonorsTypeSponsor,
  getAllDonorsTypeGrant,
  createDonor,
  getDonorById,
} from '../services/donor.service';

const getAllDonorsController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return getAllDonors()
    .then((donorList: any) => {
      res.status(StatusCode.OK).send(donorList);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve all donors'));
    });
};

const getAllDonorsOfType = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { type } = req.params;
  if (!type) {
    next(ApiError.missingFields(['type']));
    return;
  }
  if (type === 'donor') {
    return getAllDonorsTypeDonor()
      .then((donorList: any) => {
        res.status(StatusCode.OK).send(donorList);
      })
      .catch(() => {
        next(ApiError.internal('Unable to retrieve all donors of type donor'));
      });
  }
  if (type === 'sponsor') {
    return getAllDonorsTypeSponsor()
      .then((donorList: any) => {
        res.status(StatusCode.OK).send(donorList);
      })
      .catch(() => {
        next(
          ApiError.internal('Unable to retrieve all donors of type sponsor'),
        );
      });
  }
  if (type === 'grant') {
    return getAllDonorsTypeGrant()
      .then((donorList: any) => {
        res.status(StatusCode.OK).send(donorList);
      })
      .catch(() => {
        next(ApiError.internal('Unable to retrieve all donors of type grant'));
      });
  }
  //   next(ApiError.invalidFields(['type']));
};

const createDonorController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
const donor: IDonor | null = req.body as IDonor;
  if (!donor) {
    next(ApiError.missingFields(['donor']));
    return;
  }
  return createDonor(donor)
    .then((donor2: unknown) => {
      res.status(StatusCode.OK).send(donor2);
    })
  .catch((e) => {
        console.log('unable to create donor error', e.message);
        next(ApiError.internal('Unable to create donor'));
     });
 };

const getDonorByIdController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  return getDonorById(id)
    .then((donor: unknown) => {
      res.status(StatusCode.OK).send(donor);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve donor by id'));
    });
};

export {
  getAllDonorsController,
  getAllDonorsOfType,
  createDonorController,
  getDonorByIdController,
};
