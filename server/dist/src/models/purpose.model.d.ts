import mongoose from 'mongoose';
interface IPurpose extends mongoose.Document {
    _id: string;
    name: string;
    date_created: Date;
}
declare const Purpose: mongoose.Model<IPurpose, {}, {}, {}, any>;
export { IPurpose, Purpose };
//# sourceMappingURL=purpose.model.d.ts.map