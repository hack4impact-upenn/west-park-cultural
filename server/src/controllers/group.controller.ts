/* eslint-disable consistent-return */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { IGroup } from '../models/group.model';

import {
  createCommunicationGroup,
  getCommunicationGroupById,
} from '../services/group.service';

const createCommunicationGroupController = async (
  req: express.Request,
  res: express.Response,

  next: express.NextFunction,
) => {
  const group: IGroup = req.body;
  return createCommunicationGroup(group)
    .then((result: any) => {
      res.status(StatusCode.CREATED).send(result);
    })
    .catch(() => {
      next(ApiError.internal('Unable to create communication group'));
    });
};

const getCommunicationGroupByIdController = async (
  req: express.Request,
  res: express.Response,

  next: express.NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    next(ApiError.missingFields(['id']));
    return;
  }
  return getCommunicationGroupById(id)
    .then((group: unknown) => {
      res.status(StatusCode.OK).send(group);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve communication group'));
    });
};

export {
  createCommunicationGroupController,
  getCommunicationGroupByIdController,
};
