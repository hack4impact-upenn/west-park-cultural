"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Donor = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DonorSchema = new mongoose_1.default.Schema({
    contact_name: {
        type: String,
        required: true,
    },
    contact_email: {
        type: String,
        required: true,
    },
    contact_address: {
        type: String,
        required: false,
    },
    contact_phone: {
        type: String,
        required: true,
    },
    donor_group: {
        type: String,
        required: true,
    },
    registered_date: {
        type: Date,
        required: true,
    },
    last_donation_date: {
        type: Date,
        required: true,
    },
    last_communication_date: {
        type: Date,
        required: false,
    },
    type: {
        type: String,
        required: true,
    },
    comments: {
        type: String,
        required: false,
    },
    org_address: {
        type: String,
        required: false,
    },
    org_email: {
        type: String,
        required: false,
    },
    org_name: {
        type: String,
        required: false,
    },
    note: {
        type: String,
        required: false,
    },
});
const Donor = mongoose_1.default.model('Donor', DonorSchema);
exports.Donor = Donor;
//# sourceMappingURL=donor.model.js.map