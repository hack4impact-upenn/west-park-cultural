import mongoose from 'mongoose';
interface ICommunication extends mongoose.Document {
    date_sent: Date;
    donor_ids: string[];
    emails: string[];
    group_ids: string[];
    did_send: boolean;
}
declare const Communication: mongoose.Model<ICommunication, {}, {}, {}, any>;
export { ICommunication, Communication };
//# sourceMappingURL=communication.model.d.ts.map