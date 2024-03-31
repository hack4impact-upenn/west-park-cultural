import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  group_name: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    required: true,
  },
  donor_ids: {
    type: [String],
    required: true,
  },
});

interface IGroup extends mongoose.Document {
  _id: string;
  group_name: string;
  date_created: Date;
  donor_ids: string[];
}

const Group = mongoose.model<IGroup>('Group', GroupSchema);

export { IGroup, Group };
