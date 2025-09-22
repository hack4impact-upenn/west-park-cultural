"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purpose = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PurposeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    date_created: {
        type: Date,
        required: true,
    },
});
const Purpose = mongoose_1.default.model('Purpose', PurposeSchema);
exports.Purpose = Purpose;
//# sourceMappingURL=purpose.model.js.map