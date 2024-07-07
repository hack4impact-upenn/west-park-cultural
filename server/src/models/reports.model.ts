import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DonorSchema = new mongoose.Schema({
  _id: String,
  contact_name: String,
});

const ReportDataSchema = new mongoose.Schema({
  total_donated: {
    type: Number,
  },
  total_donations: {
    type: Number,
  },
  average_donations: {
    type: Number,
  },
  average_donations_per_person: {
    type: Number,
  },
  top_donator: {
    amount: {
      type: Number,
    },
    donor_name: {
      type: String,
    },
    donor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
    },
  },
  largest_donation: {
    amount: {
      type: Number,
    },
    donation_id: {
      type: String,
    },
    donor_name: {
      type: String,
    },
    donor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
    },
  },
});

const ReportsSchema = new mongoose.Schema({
  last_fiscal: {
    type: ReportDataSchema,
  },
  last_calendar: {
    type: ReportDataSchema,
  },
  last_90: {
    type: ReportDataSchema,
  },
  last_30: {
    type: ReportDataSchema,
  },
  last_all: {
    type: ReportDataSchema,
  },
  date_generated: {
    type: Date,
    default: Date.now,
  },
});

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

const Reports = mongoose.model<IReports>('Reports', ReportsSchema);

export { IReports, Reports };
