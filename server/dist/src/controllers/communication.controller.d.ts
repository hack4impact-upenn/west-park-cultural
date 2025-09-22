import express from 'express';
declare const createCommunicationController: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const getCommunicationByIdController: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const getAllCommunicationsController: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
export { createCommunicationController, getCommunicationByIdController, getAllCommunicationsController, };
//# sourceMappingURL=communication.controller.d.ts.map