import express from 'express';
// eslint-disable-next-line
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import {
  getAllDonationsInDB,
  getDonationByIdInDB,
  getDonationByDonorIdInDB,
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

export {
    getAllDonations,
  };