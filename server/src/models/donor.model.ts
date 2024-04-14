import mongoose from 'mongoose';

const DonorSchema = new mongoose.Schema({
  contact_name: {
    type: String,
    required: true,
  },
  contact_email: {
    type: String,
    required: true,
  },
  contact_address: {
    type: String,
    required: true,
  },
  contact_phone: {
    type: String,
    required: true,
  },
  donor_group: {
    type: String,
    required: true,
  },
  registered_date: {
    type: Date,
    required: true,
  },
  last_donation_date: {
    type: Date,
    required: true,
  },
  last_communication_date: {
    type: Date,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  org_address: {
    type: String,
    required: false,
  },
  org_email: {
    type: String,
    required: false,
  },
  org_name: {
    type: String,
    required: false,
  },
});

interface IDonor extends mongoose.Document {
  _id: string;
  contact_name: string;
  contact_email: string;
  contact_address: string;
  contact_phone: string;
  donor_group: string;
  registered_date: Date;
  last_donation_date: Date;
  last_communication_date: string;
  type: string;
  comments: string;
  org_address: string;
  org_email: string;
  org_name: string;
}

const Donor = mongoose.model<IDonor>('Donor', DonorSchema);

export { IDonor, Donor };
