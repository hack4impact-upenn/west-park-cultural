import mongoose from 'mongoose';

const DonorSchema = new mongoose.Schema({
  _id: String,
  contact_name: String,
});

const ReportDataSchema = new mongoose.Schema({
  total_donated: {
    type: Number,
    required: true,
  },
  total_donations: {
    type: Number,
    required: true,
  },
  average_donations: {
    type: Number,
    required: true,
  },
  average_donations_per_person: {
    type: Number,
    required: true,
  },
  top_donator: {
    amount: {
      type: Number,
      required: true,
    },
    donor_name: {
      type: String,
      required: true,
    },
    donor_id: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Donor' ,
      required: true,
    },
  },
  largest_donation: {
    amount: {
      type: Number,
      required: true,
    },
    donation_id: {
      type: String,
      required: true,
    },
    donor_name: {
      type: String,
      required: true,
    },
    donor_id: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Donor' ,
      required: true,
    },
  }
});

const ReportsSchema = new mongoose.Schema({
  last_fiscal: {
    type: ReportDataSchema,
    required: true,
  },
  last_calendar: {
    type: ReportDataSchema,
    required: true,
  },
  last_90: {
    type: ReportDataSchema,
    required: true,
  },
  last_30: {
    type: ReportDataSchema,
    required: true,
  },
  last_all: {
    type: ReportDataSchema,
    required: true,
  },
  date_generated: {
    type: Date,
    default: Date.now,
  },
});

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

const Reports = mongoose.model<IReports>('Reports', ReportsSchema);

export { IReports, Reports };
