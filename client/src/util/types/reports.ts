/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';

interface IReportData {
  total_donated: number;
  total_donations: number;
  average_donations: number;
  average_donations_per_person: number;
  top_donator: {
    amount: number;
    donor_name: string;
    donor_id: string;
  }
  largest_donation: {
    amount: number;
    donation_id: string;
    donor_name: string;
    donor_id: string;
  };
}

interface IReports extends mongoose.Document {
  _id: string;
  last_fiscal: IReportData;
  last_calendar: IReportData;
  last_90: IReportData;
  last_30: IReportData;
  last_all: IReportData;
  date_generated: Date;
}
export default IReports;
