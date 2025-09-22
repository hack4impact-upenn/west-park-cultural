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
exports.deleteDonationById = exports.editDonationById = exports.acknowledgeDonation = exports.createDonation = exports.getAllDonationsbyDonorId = exports.getDonationById = exports.getAllDonationsOfTypeGrant = exports.getAllDonationsOfTypeSponsorship = exports.getAllDonationsOfTypeDonation = exports.getAll = void 0;
const donation_model_1 = require("../models/donation.model");
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const donations = yield donation_model_1.Donation.find().exec();
    return donations;
});
exports.getAll = getAll;
const getAllDonationsOfTypeDonation = () => __awaiter(void 0, void 0, void 0, function* () {
    const donations = yield donation_model_1.Donation.find({ type: 'donation' }).exec();
    return donations;
});
exports.getAllDonationsOfTypeDonation = getAllDonationsOfTypeDonation;
const getAllDonationsOfTypeSponsorship = () => __awaiter(void 0, void 0, void 0, function* () {
    const donations = yield donation_model_1.Donation.find({ type: 'sponsorship' }).exec();
    return donations;
});
exports.getAllDonationsOfTypeSponsorship = getAllDonationsOfTypeSponsorship;
const getAllDonationsOfTypeGrant = () => __awaiter(void 0, void 0, void 0, function* () {
    const donations = yield donation_model_1.Donation.find({ type: 'grant' }).exec();
    return donations;
});
exports.getAllDonationsOfTypeGrant = getAllDonationsOfTypeGrant;
const getDonationById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const donation = yield donation_model_1.Donation.findById(id).exec();
    return donation;
});
exports.getDonationById = getDonationById;
const getAllDonationsbyDonorId = (donorId) => __awaiter(void 0, void 0, void 0, function* () {
    const donations = yield donation_model_1.Donation.find({ donor_id: donorId }).exec();
    return donations;
});
exports.getAllDonationsbyDonorId = getAllDonationsbyDonorId;
const createDonation = (donation) => __awaiter(void 0, void 0, void 0, function* () {
    const newDonation = new donation_model_1.Donation(donation);
    console.log(newDonation);
    const result = yield newDonation.save();
    return result;
});
exports.createDonation = createDonation;
const acknowledgeDonation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const donation = yield donation_model_1.Donation.findById(id).exec();
    if (donation) {
        donation.acknowledged = true;
        const result = yield donation.save();
        return result;
    }
    return null;
});
exports.acknowledgeDonation = acknowledgeDonation;
const editDonationById = (_id, newDonationInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const donation = yield donation_model_1.Donation.updateOne({ _id }, newDonationInfo).exec();
        return donation;
    }
    catch (error) {
        throw new Error('Error updating donation');
    }
});
exports.editDonationById = editDonationById;
const deleteDonationById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const donation = yield donation_model_1.Donation.findByIdAndDelete(id).exec();
        return donation;
    }
    catch (error) {
        throw new Error('Error deleting lesson');
    }
});
exports.deleteDonationById = deleteDonationById;
//# sourceMappingURL=donation.service.js.map