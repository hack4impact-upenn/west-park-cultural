"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPurposes = exports.getPurposeById = exports.createPurpose = void 0;
const purpose_model_1 = require("../models/purpose.model");
const createPurpose = (purpose) => __awaiter(void 0, void 0, void 0, function* () {
    const newPurpose = new purpose_model_1.Purpose(purpose);
    const result = yield newPurpose.save().catch((err) => {
        console.log(err.message);
    });
    return result;
});
exports.createPurpose = createPurpose;
const getPurposeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const purpose = yield purpose_model_1.Purpose.findById(id).exec();
    return purpose;
});
exports.getPurposeById = getPurposeById;
const getAllPurposes = () => __awaiter(void 0, void 0, void 0, function* () {
    const purposes = yield purpose_model_1.Purpose.find().exec();
    return purposes;
});
exports.getAllPurposes = getAllPurposes;
//# sourceMappingURL=purpose.service.js.map