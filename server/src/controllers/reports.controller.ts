/* eslint-disable consistent-return */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { IReports } from '../models/reports.model';

import {
    getAllReports,
    createReports
} from '../services/reports.service';


const getAllReportsController = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    return getAllReports()
      .then((reportsList: any) => {
        res.status(StatusCode.OK).send(reportsList);
      })
      .catch(() => {
        next(ApiError.internal('Unable to retrieve all purposes'));
      });
  };

  const createReportsController = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const reports: IReports = req.body;
    return createReports(reports)
      .then((result: any) => {
        res.status(StatusCode.CREATED).send(result);
      })
      .catch(() => {
        next(ApiError.internal('Unable to create purpose'));
      });
  };
  
  export {
    getAllReportsController,
    createReportsController,
  };
  