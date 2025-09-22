import express from 'express';
declare const getAllDonorsController: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const getAllDonorsOfType: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const createDonorController: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const getDonorByIdController: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const editDonor: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const updateDonorRecentDonation: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const updateDonorNote: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
export { getAllDonorsController, getAllDonorsOfType, createDonorController, getDonorByIdController, editDonor, updateDonorNote, updateDonorRecentDonation, };
//# sourceMappingURL=donor.controller.d.ts.map