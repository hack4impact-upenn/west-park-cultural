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
exports.updateRecentDonationDate = exports.updateNote = exports.editDonorById = exports.getDonorById = exports.createDonor = exports.getAllDonorsTypeGrant = exports.getAllDonorsTypeSponsor = exports.getAllDonorsTypeDonor = exports.getAllDonors = void 0;
const donor_model_1 = require("../models/donor.model");
const getAllDonors = () => __awaiter(void 0, void 0, void 0, function* () {
    const donors = yield donor_model_1.Donor.find().exec();
    return donors;
});
exports.getAllDonors = getAllDonors;
const getAllDonorsTypeDonor = () => __awaiter(void 0, void 0, void 0, function* () {
    const donors = yield donor_model_1.Donor.find({ type: 'donor' }).exec();
    return donors;
});
exports.getAllDonorsTypeDonor = getAllDonorsTypeDonor;
const getAllDonorsTypeSponsor = () => __awaiter(void 0, void 0, void 0, function* () {
    const donors = yield donor_model_1.Donor.find({ type: 'sponsor' }).exec();
    return donors;
});
exports.getAllDonorsTypeSponsor = getAllDonorsTypeSponsor;
const getAllDonorsTypeGrant = () => __awaiter(void 0, void 0, void 0, function* () {
    const donors = yield donor_model_1.Donor.find({ type: 'grant' }).exec();
    return donors;
});
exports.getAllDonorsTypeGrant = getAllDonorsTypeGrant;
const createDonor = (donor) => __awaiter(void 0, void 0, void 0, function* () {
    const newDonor = new donor_model_1.Donor(donor);
    const result = yield newDonor.save();
    return result;
});
exports.createDonor = createDonor;
const getDonorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const donor = yield donor_model_1.Donor.findById(id).exec();
    return donor;
});
exports.getDonorById = getDonorById;
const editDonorById = (_id, newDonorInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const donor = yield donor_model_1.Donor.updateOne({ _id }, newDonorInfo).exec();
        return donor;
    }
    catch (error) {
        throw new Error('Error updating donation');
    }
});
exports.editDonorById = editDonorById;
const updateNote = (id, note) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const donor = yield donor_model_1.Donor.findOneAndUpdate({ _id: id }, { $set: { [`note`]: note } }, // Update the 'note' field with the new value
        { new: true }).exec();
        return donor;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.updateNote = updateNote;
const updateRecentDonationDate = (id, last_donation_date) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const donor = yield donor_model_1.Donor.findOneAndUpdate({ _id: id }, { $set: { [`last_donation_date`]: last_donation_date } }, { new: true }).exec();
        return donor;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.updateRecentDonationDate = updateRecentDonationDate;
//# sourceMappingURL=donor.service.js.map