import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  donor_id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purpose_id: {
    type: String,
    required: true,
  },
  acknowledged: {
    type: Boolean,
    required: true,
    default: false,
  },
  payment_type: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
    required: false,
  },
});

interface IDonation extends mongoose.Document {
  _id: string;
  donor_id: string;
  date: Date;
  amount: number;
  purpose_id: string;
  acknowledged: boolean;
  payment_type: string;
  type: string;
  comments: string;
}

const Donation = mongoose.model<IDonation>('Donation', DonationSchema);

export { IDonation, Donation };
