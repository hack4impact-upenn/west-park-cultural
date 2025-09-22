import { IDonation } from '../models/donation.model';
declare const getAll: () => Promise<(IDonation & Required<{
    _id: string;
}>)[]>;
declare const getAllDonationsOfTypeDonation: () => Promise<(IDonation & Required<{
    _id: string;
}>)[]>;
declare const getAllDonationsOfTypeSponsorship: () => Promise<(IDonation & Required<{
    _id: string;
}>)[]>;
declare const getAllDonationsOfTypeGrant: () => Promise<(IDonation & Required<{
    _id: string;
}>)[]>;
declare const getDonationById: (id: string) => Promise<(IDonation & Required<{
    _id: string;
}>) | null>;
declare const getAllDonationsbyDonorId: (donorId: string) => Promise<(IDonation & Required<{
    _id: string;
}>)[]>;
declare const createDonation: (donation: IDonation) => Promise<IDonation & Required<{
    _id: string;
}>>;
declare const acknowledgeDonation: (id: string) => Promise<(IDonation & Required<{
    _id: string;
}>) | null>;
declare const editDonationById: (_id: string, newDonationInfo: IDonation) => Promise<import("mongodb").UpdateResult>;
declare const deleteDonationById: (id: string) => Promise<(IDonation & Required<{
    _id: string;
}>) | null>;
export { getAll, getAllDonationsOfTypeDonation, getAllDonationsOfTypeSponsorship, getAllDonationsOfTypeGrant, getDonationById, getAllDonationsbyDonorId, createDonation, acknowledgeDonation, editDonationById, deleteDonationById, };
//# sourceMappingURL=donation.service.d.ts.map