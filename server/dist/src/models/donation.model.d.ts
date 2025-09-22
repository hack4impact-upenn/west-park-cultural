import mongoose from 'mongoose';
interface IDonation extends mongoose.Document {
    _id: string;
    type: string;
    payment_type: string;
    grant_year: string;
    date: Date;
    amount: number;
    acknowledged: boolean;
    donor_id: string;
    purpose_id: string;
    comments: string;
}
declare const Donation: mongoose.Model<IDonation, {}, {}, {}, any>;
export { IDonation, Donation };
//# sourceMappingURL=donation.model.d.ts.map