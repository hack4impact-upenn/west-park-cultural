import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['donation', 'sponsorship', 'grant'],
    required: true,
  },
  payment_type: {
    type: String,
    enum: ['mail check', 'credit', 'paypal', 'other'],
    required: true,
  },
  grant_year: {
    type: String,
    enum: ['multi-year', 'single-year'],
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  acknowledged: {
    type: Boolean,
    required: true,
    default: false,
  },
  donor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
  },
  purpose_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purpose',
  },
  comments: {
    type: String,
    required: false,
  },
});

interface IDonation extends mongoose.Document {
  _id: string;
  type: string;
  payment_type: string;
  grant_year: string;
  date: Date;
  amount: number;
  acknowledged: boolean;
  donor_id: string;
  purpose_id: string;
  comments: string;
}

const Donation = mongoose.model<IDonation>('Donation', DonationSchema);

export { IDonation, Donation };
