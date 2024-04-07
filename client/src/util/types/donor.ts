/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';

interface IDonor extends mongoose.Document {
  _id: string;
  contact_name: string;
  contact_email: string;
  contact_address: string;
  contact_phone: string;
  donor_group: string;
  registered_date: Date;
  last_donation_date: Date;
  type: string;
  comments: string;
}

export default IDonor;
