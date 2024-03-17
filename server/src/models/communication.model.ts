import mongoose from 'mongoose';

const CommunicationSchema = new mongoose.Schema({
  date_sent: {
    type: Date,
    required: true,
  },
  donor_ids: {
    type: [String],
    required: true,
  },
  emails: {
    type: [String],
    required: true,
  },
  group_ids: {
    type: [String],
    required: true,
  },
  did_send: {
    type: Boolean,
    required: true,
    default: false,
  },
});

interface ICommunication extends mongoose.Document {
  date_sent: Date;
  donor_ids: string[];
  emails: string[];
  group_ids: string[];
  did_send: boolean;
}

const Communication = mongoose.model<ICommunication>(
  'Communication',
  CommunicationSchema,
);

export { ICommunication, Communication };
