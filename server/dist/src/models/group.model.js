"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const GroupSchema = new mongoose_1.default.Schema({
    group_name: {
        type: String,
        required: true,
    },
    date_created: {
        type: Date,
        required: true,
    },
    donor_ids: {
        type: [String],
        required: true,
    },
});
const Group = mongoose_1.default.model('Group', GroupSchema);
exports.Group = Group;
//# sourceMappingURL=group.model.js.map