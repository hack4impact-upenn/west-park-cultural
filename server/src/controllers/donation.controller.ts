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
  editDonationById,
  deleteDonationById,
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
  const newDonation: IDonation = req.body;
  return createDonation(newDonation)
    .then((donation: IDonation) => {
      res.status(StatusCode.CREATED).send(donation);
    })
    .catch(() => {
      next(ApiError.internal('Unable to create donation'));
    });
};

const editDonation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { donation_id, ...restOfBody } = req.body;

  editDonationById(donation_id, restOfBody)
    .then((response) => res.status(StatusCode.OK).send(response))
    .catch((e: any) => {
      console.log(e);
      next(ApiError.internal('Failed to edit donation.'));
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

const deleteDonation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { donation_id } = req.body;
  deleteDonationById(donation_id)
    .then((response) =>
      response
        ? res.status(StatusCode.OK).send(response)
        : res.sendStatus(StatusCode.NOT_FOUND),
    )
    .catch((e: any) => {
      console.log(e);
      next(ApiError.internal('Failed to delete lesson.'));
    });
};

export {
  getAllDonations,
  getAllDonationsOfType,
  getDonation,
  getDonationsByDonorId,
  createNewDonation,
  acknowledgeDonationById,
  editDonation,
  deleteDonation,
};