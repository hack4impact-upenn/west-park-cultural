import { IPurpose } from '../models/purpose.model';
declare const createPurpose: (purpose: IPurpose) => Promise<void | (IPurpose & Required<{
    _id: string;
}>)>;
declare const getPurposeById: (id: string) => Promise<(IPurpose & Required<{
    _id: string;
}>) | null>;
declare const getAllPurposes: () => Promise<(IPurpose & Required<{
    _id: string;
}>)[]>;
export { createPurpose, getPurposeById, getAllPurposes };
//# sourceMappingURL=purpose.service.d.ts.map