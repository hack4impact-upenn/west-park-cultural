
/* eslint-disable consistent-return */
/* eslint-disable import/named */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { IDonation } from '../models/donation.model';

import {
  getAll,
  getAllDonationsOfTypeDonation,
  getAllDonationsOfTypeSponsorship,
  getAllDonationsOfTypeGrant,
  getDonationById,
  getAllDonationsbyDonorId,
  createDonation,
  acknowledgeDonation,
} from '../services/donation.service';

const getAllResources = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    return (
        getAllDonationsInDB()
        .then((donationList) => {
          res.status(StatusCode.OK).send(donationList);
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((e) => {
          next(ApiError.internal('Unable to retrieve all resources'));
        })
    );
  };
const getAllDonations = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return getAllDonationsInDB()
    .then((donationList) => {
      const sorted = donationList.sort((a, b) => b.date - a.date);
      res.status(StatusCode.OK).send(sorted);
    })
    .catch((e) => {
      console.log(e);
      next(ApiError.internal('Unable to retrieve all donations'));
    });
};


const getAllDonationsOfType = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { type } = req.params;
  if (!type) {
    next(ApiError.missingFields(['type']));
    return;
  }
  if (type === 'donation') {
    return getAllDonationsOfTypeDonation()
      .then((donationList: unknown) => {
        res.status(StatusCode.OK).send(donationList);
      })
      .catch(() => {
        next(
          ApiError.internal(
            'Unable to retrieve all donations of type donation',
          ),
        );
      });
  }
  if (type === 'sponsorship') {
    return getAllDonationsOfTypeSponsorship()
      .then((donationList: any) => {
        res.status(StatusCode.OK).send(donationList);
      })
      .catch(() => {
        next(
          ApiError.internal(
            'Unable to retrieve all donations of type sponsorship',
          ),
        );
      });
  }
  if (type === 'grant') {
    return getAllDonationsOfTypeGrant()
      .then((donationList: any) => {
        res.status(StatusCode.OK).send(donationList);
      })
      .catch(() => {
        next(
          ApiError.internal('Unable to retrieve all donations of type grant'),
        );
      });
  }
  next(ApiError.badRequest('Invalid type'));
};

const getDonation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  return getDonationById(id)
    .then((donation: any) => {
      res.status(StatusCode.OK).send(donation);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve donation'));
    });
};

const getDonationsByDonorId = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  return getAllDonationsbyDonorId(id)
    .then((donationList: any) => {
      res.status(StatusCode.OK).send(donationList);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve donations'));
    });
};

const createNewDonation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { donorId, date, amount, purposeId, paymentType, type } = req.body;
  if (!donorId || !date || !amount || !purposeId || !paymentType || !type) {
    next(
      ApiError.missingFields([
        'donorId',
        'date',
        'amount',
        'purposeId',
        'paymentType',
        'type',
      ]),
    );
    return;
  }
  const newDonation: IDonation | null = req.body.donation as IDonation;
  return createDonation(newDonation)
    .then((donation: any) => {
      res.status(StatusCode.CREATED).send(donation);
    })
    .catch(() => {
      next(ApiError.internal('Unable to create donation'));
    });
};

const acknowledgeDonationById = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  return acknowledgeDonation(id)
    .then((donation: any) => {
      res.status(StatusCode.OK).send(donation);
    })
    .catch(() => {
      next(ApiError.internal('Unable to acknowledge donation'));
    });
};

export {
  getAllDonations,
  getAllDonationsOfType,
  getDonation,
  getDonationsByDonorId,
  createNewDonation,
  acknowledgeDonationById,
};
