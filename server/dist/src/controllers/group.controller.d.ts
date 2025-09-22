import express from 'express';
declare const getAllGroupsController: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const createCommunicationGroupController: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const getCommunicationGroupByIdController: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const editGroupController: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
export { createCommunicationGroupController, getCommunicationGroupByIdController, getAllGroupsController, editGroupController, };
//# sourceMappingURL=group.controller.d.ts.map