import mongoose from 'mongoose';

const PurposeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  data_created: {
    type: Date,
    required: true,
  },
});

interface IPurpose extends mongoose.Document {
  _id: string;
  name: string;
  data_created: Date;
}

const Purpose = mongoose.model<IPurpose>('Purpose', PurposeSchema);

export { IPurpose, Purpose };
