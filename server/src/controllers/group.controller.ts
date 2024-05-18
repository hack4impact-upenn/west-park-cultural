/* eslint-disable consistent-return */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { IGroup } from '../models/group.model';

import {
  createCommunicationGroup,
  getCommunicationGroupById,
  getAllGroups,
  editGroupById,
} from '../services/group.service';

const getAllGroupsController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  return getAllGroups()
    .then((list: any) => {
      res.status(StatusCode.OK).send(list);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve all groups'));
    });
};

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

const editGroupController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  // eslint-disable-next-line camelcase
  const { _id, ...restOfBody } = req.body;
  editGroupById(_id, restOfBody)
    .then((response) => res.status(StatusCode.OK).send(response))
    .catch((e: any) => {
      console.log(e);
      next(ApiError.internal('Failed to edit group.'));
    });
};

export {
  createCommunicationGroupController,
  getCommunicationGroupByIdController,
  getAllGroupsController,
  editGroupController,
};
