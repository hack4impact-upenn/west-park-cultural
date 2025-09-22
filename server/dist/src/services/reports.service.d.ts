import { IReports } from '../models/reports.model';
declare const createReports: (reports: IReports) => Promise<void | (IReports & Required<{
    _id: string;
}>)>;
declare const getReportsByDate: (date: Date) => Promise<void>;
declare const getAllReports: () => Promise<(IReports & Required<{
    _id: string;
}>)[]>;
export { createReports, getReportsByDate, getAllReports };
//# sourceMappingURL=reports.service.d.ts.map