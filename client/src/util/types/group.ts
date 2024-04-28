/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';

interface IGroup extends mongoose.Document {
  _id: string;
  group_name: string;
  date_created: Date;
  donor_ids: string[];
}

export default IGroup;
