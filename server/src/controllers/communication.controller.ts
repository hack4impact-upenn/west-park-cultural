/* eslint-disable consistent-return */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { ICommunication } from '../models/communication.model';

import {
  createCommunication,
  getCommunicationById,
  getAllCommunications,
} from '../services/communication.service';

const createCommunicationController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const communication: ICommunication = req.body;
  return createCommunication(communication)
    .then((result: any) => {
      res.status(StatusCode.CREATED).send(result);
    })
    .catch(() => {
      next(ApiError.internal('Unable to create communication'));
    });
};

const getCommunicationByIdController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  return getCommunicationById(id)
    .then((communication: unknown) => {
      res.status(StatusCode.OK).send(communication);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve communication'));
    });
};

const getAllCommunicationsController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return getAllCommunications()
    .then((communicationList: any) => {
      res.status(StatusCode.OK).send(communicationList);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve all communications'));
    });
};

export {
  createCommunicationController,
  getCommunicationByIdController,
  getAllCommunicationsController,
};
