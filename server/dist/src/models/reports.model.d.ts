import mongoose from 'mongoose';
interface IReportData {
    total_donated: number | null;
    total_donations: number | null;
    average_donations: number | null;
    average_donations_per_person: number | null;
    top_donator: {
        amount: number | null;
        donor_name: string | null;
        donor_id: string | null;
    } | null;
    largest_donation: {
        amount: number | null;
        donation_id: string | null;
        donor_name: string | null;
        donor_id: string | null;
    } | null;
}
interface IReports extends mongoose.Document {
    _id: string;
    last_fiscal: IReportData | null;
    last_calendar: IReportData | null;
    last_90: IReportData | null;
    last_30: IReportData | null;
    last_all: IReportData | null;
    date_generated: Date;
}
declare const Reports: mongoose.Model<IReports, {}, {}, {}, any>;
export { IReports, Reports };
//# sourceMappingURL=reports.model.d.ts.map