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
    last_communication_date: Date;
    type: string;
    comments: string;
    org_address: string;
    org_email: string;
    org_name: string;
    note: string;
}
declare const Donor: mongoose.Model<IDonor, {}, {}, {}, any>;
export { IDonor, Donor };
//# sourceMappingURL=donor.model.d.ts.map