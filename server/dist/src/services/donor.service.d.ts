import { IDonor } from '../models/donor.model';
declare const getAllDonors: () => Promise<(IDonor & Required<{
    _id: string;
}>)[]>;
declare const getAllDonorsTypeDonor: () => Promise<(IDonor & Required<{
    _id: string;
}>)[]>;
declare const getAllDonorsTypeSponsor: () => Promise<(IDonor & Required<{
    _id: string;
}>)[]>;
declare const getAllDonorsTypeGrant: () => Promise<(IDonor & Required<{
    _id: string;
}>)[]>;
declare const createDonor: (donor: IDonor) => Promise<IDonor & Required<{
    _id: string;
}>>;
declare const getDonorById: (id: string) => Promise<(IDonor & Required<{
    _id: string;
}>) | null>;
declare const editDonorById: (_id: string, newDonorInfo: IDonor) => Promise<import("mongodb").UpdateResult>;
declare const updateNote: (id: string, note: string) => Promise<(IDonor & Required<{
    _id: string;
}>) | null>;
declare const updateRecentDonationDate: (id: string, last_donation_date: Date) => Promise<(IDonor & Required<{
    _id: string;
}>) | null>;
export { getAllDonors, getAllDonorsTypeDonor, getAllDonorsTypeSponsor, getAllDonorsTypeGrant, createDonor, getDonorById, editDonorById, updateNote, updateRecentDonationDate, };
//# sourceMappingURL=donor.service.d.ts.map