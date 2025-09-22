import express from 'express';
declare const getAllDonations: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const getAllDonationsOfType: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const getDonation: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const getDonationsByDonorId: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const createNewDonation: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const editDonation: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const acknowledgeDonationById: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
declare const deleteDonation: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
export { getAllDonations, getAllDonationsOfType, getDonation, getDonationsByDonorId, createNewDonation, acknowledgeDonationById, editDonation, deleteDonation, };
//# sourceMappingURL=donation.controller.d.ts.map