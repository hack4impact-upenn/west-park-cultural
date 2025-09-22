"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reports = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DonorSchema = new mongoose_1.default.Schema({
    _id: String,
    contact_name: String,
});
const ReportDataSchema = new mongoose_1.default.Schema({
    total_donated: {
        type: Number,
    },
    total_donations: {
        type: Number,
    },
    average_donations: {
        type: Number,
    },
    average_donations_per_person: {
        type: Number,
    },
    top_donator: {
        amount: {
            type: Number,
        },
        donor_name: {
            type: String,
        },
        donor_id: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Donor',
        },
    },
    largest_donation: {
        amount: {
            type: Number,
        },
        donation_id: {
            type: String,
        },
        donor_name: {
            type: String,
        },
        donor_id: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Donor',
        },
    },
});
const ReportsSchema = new mongoose_1.default.Schema({
    last_fiscal: {
        type: ReportDataSchema,
    },
    last_calendar: {
        type: ReportDataSchema,
    },
    last_90: {
        type: ReportDataSchema,
    },
    last_30: {
        type: ReportDataSchema,
    },
    last_all: {
        type: ReportDataSchema,
    },
    date_generated: {
        type: Date,
        default: Date.now,
    },
});
const Reports = mongoose_1.default.model('Reports', ReportsSchema);
exports.Reports = Reports;
//# sourceMappingURL=reports.model.js.map