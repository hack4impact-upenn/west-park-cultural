import mongoose from 'mongoose';
interface IGroup extends mongoose.Document {
    _id: string;
    group_name: string;
    date_created: Date;
    donor_ids: string[];
}
declare const Group: mongoose.Model<IGroup, {}, {}, {}, any>;
export { IGroup, Group };
//# sourceMappingURL=group.model.d.ts.map