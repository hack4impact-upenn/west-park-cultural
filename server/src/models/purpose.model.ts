import mongoose from 'mongoose';

const PurposeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    required: true,
  },
});

interface IPurpose extends mongoose.Document {
  _id: string;
  name: string;
  date_created: Date;
}

const Purpose = mongoose.model<IPurpose>('Purpose', PurposeSchema);

export { IPurpose, Purpose };
