"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Donation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DonationSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        enum: ['donation', 'sponsorship', 'grant'],
        required: true,
    },
    payment_type: {
        type: String,
        // enum: ['check', 'credit card', 'other'],
        required: true,
    },
    grant_year: {
        type: String,
        enum: ['multi-year', 'single-year'],
        required: false,
    },
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    acknowledged: {
        type: Boolean,
        required: true,
        default: false,
    },
    donor_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true,
    },
    purpose_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Purpose',
        required: true,
    },
    comments: {
        type: String,
        required: false,
    },
});
const Donation = mongoose_1.default.model('Donation', DonationSchema);
exports.Donation = Donation;
//# sourceMappingURL=donation.model.js.map