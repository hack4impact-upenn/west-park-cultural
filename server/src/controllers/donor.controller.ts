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
  editDonorById,
  getDonorById,
  updateNote,
  updateRecentDonationDate,
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
  const donor: IDonor | null = req.body;
  console.log(req.body);
  if (!donor) {
    next(ApiError.missingFields(['donor']));
    return;
  }
  return createDonor(donor)
    .then((results: any) => {
      res.status(StatusCode.OK).send(results);
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

const editDonor = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // eslint-disable-next-line camelcase
  const { donor_id, ...restOfBody } = req.body;
  editDonorById(donor_id, restOfBody)
    .then((response) => res.status(StatusCode.OK).send(response))
    .catch((e: any) => {
      console.log(e);
      next(ApiError.internal('Failed to edit donation.'));
    });
};

const updateDonorRecentDonation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id, date } = req.body;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  if (!date) {
    next(ApiError.missingFields(['date']));
    return;
  }
  const donor = updateRecentDonationDate(id, date);
  res.status(StatusCode.OK).send(donor);
};

const updateDonorNote = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id, note } = req.body;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  if (!note) {
    next(ApiError.missingFields(['note']));
    return;
  }

  const donor = updateNote(id, note);
  res.status(StatusCode.OK).send(donor);
};

export {
  getAllDonorsController,
  getAllDonorsOfType,
  createDonorController,
  getDonorByIdController,
  editDonor,
  updateDonorNote,
  updateDonorRecentDonation,
};
