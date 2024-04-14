/* eslint-disable camelcase */
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

const getAllDonations = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return getAll()
    .then((donationList: any) => {
      res.status(StatusCode.OK).send(donationList);
    })
    .catch(() => {
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
  const { donorId } = req.params;
  if (!donorId) {
    next(ApiError.missingFields(['donorId']));
    return;
  }
  return getAllDonationsbyDonorId(donorId)
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
  const { donor_id, date, amount, purpose_id, payment_type, type } = req.body;
  if (!donor_id || !date || !amount || !purpose_id || !payment_type || !type) {
    next(
      ApiError.missingFields([
        'donor_id',
        'date',
        'amount',
        'purpose_id',
        'payment_type',
        'type',
      ]),
    );
    return;
  }
  // const newDonation: IDonation | null = req.body.donation as IDonation;
  const newDonation: IDonation | null = req.body as IDonation;
  return createDonation(newDonation)
    .then((donation: any) => {
      res.status(StatusCode.CREATED).send(donation);
    })
    .catch((e) => {
      console.log(e.message);
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
