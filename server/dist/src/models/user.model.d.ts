/**
 * Defines the User model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose from 'mongoose';
interface IUser extends mongoose.Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    verified: boolean;
    verificationToken: string | null | undefined;
    resetPasswordToken: string | null | undefined;
    resetPasswordTokenExpiryDate: Date | null | undefined;
    admin: boolean;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, any>;
export { IUser, User };
//# sourceMappingURL=user.model.d.ts.map