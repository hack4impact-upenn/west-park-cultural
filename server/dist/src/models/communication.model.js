"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Communication = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CommunicationSchema = new mongoose_1.default.Schema({
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
const Communication = mongoose_1.default.model('Communication', CommunicationSchema);
exports.Communication = Communication;
//# sourceMappingURL=communication.model.js.map