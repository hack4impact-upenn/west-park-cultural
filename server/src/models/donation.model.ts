import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'donation',
      'sponsorship',
      'grant',
    ],
    required: true,
  },
  payment_type: {
    type: String,
    enum: [
      'mail check',
      'credit',
      'paypal',
      'other',
    ],
    required: true,
  },
  year: {
    type: String,
    enum: [
      'multi-year',
      'single-year',
    ],
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
    required: false,
    default: false,
  },
  donor_id: {
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
    required: true,
  },
  purpose_id: {
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'Purpose' },
    required: true,
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
  year: string;
  date: Date;
  amount: number;
  acknowledged: boolean;
  donor_id: string;
  purpose_id: string;
  comments: string;
}

const Donation = mongoose.model<IDonation>('Donation', DonationSchema);

export { IDonation, Donation };
