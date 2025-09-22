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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDonation = exports.editDonation = exports.acknowledgeDonationById = exports.createNewDonation = exports.getDonationsByDonorId = exports.getDonation = exports.getAllDonationsOfType = exports.getAllDonations = void 0;
const apiError_1 = __importDefault(require("../util/apiError"));
const statusCode_1 = __importDefault(require("../util/statusCode"));
const donation_service_1 = require("../services/donation.service");
const getAllDonations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, donation_service_1.getAll)()
        .then((donationList) => {
        res.status(statusCode_1.default.OK).send(donationList);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to retrieve all donations'));
    });
});
exports.getAllDonations = getAllDonations;
const getAllDonationsOfType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    if (!type) {
        next(apiError_1.default.missingFields(['type']));
        return;
    }
    if (type === 'donation') {
        return (0, donation_service_1.getAllDonationsOfTypeDonation)()
            .then((donationList) => {
            res.status(statusCode_1.default.OK).send(donationList);
        })
            .catch(() => {
            next(apiError_1.default.internal('Unable to retrieve all donations of type donation'));
        });
    }
    if (type === 'sponsorship') {
        return (0, donation_service_1.getAllDonationsOfTypeSponsorship)()
            .then((donationList) => {
            res.status(statusCode_1.default.OK).send(donationList);
        })
            .catch(() => {
            next(apiError_1.default.internal('Unable to retrieve all donations of type sponsorship'));
        });
    }
    if (type === 'grant') {
        return (0, donation_service_1.getAllDonationsOfTypeGrant)()
            .then((donationList) => {
            res.status(statusCode_1.default.OK).send(donationList);
        })
            .catch(() => {
            next(apiError_1.default.internal('Unable to retrieve all donations of type grant'));
        });
    }
    next(apiError_1.default.badRequest('Invalid type'));
});
exports.getAllDonationsOfType = getAllDonationsOfType;
const getDonation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        next(apiError_1.default.missingFields(['id']));
        return;
    }
    return (0, donation_service_1.getDonationById)(id)
        .then((donation) => {
        res.status(statusCode_1.default.OK).send(donation);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to retrieve donation'));
    });
});
exports.getDonation = getDonation;
const getDonationsByDonorId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        next(apiError_1.default.missingFields(['id']));
        return;
    }
    return (0, donation_service_1.getAllDonationsbyDonorId)(id)
        .then((donationList) => {
        res.status(statusCode_1.default.OK).send(donationList);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to retrieve donations'));
    });
});
exports.getDonationsByDonorId = getDonationsByDonorId;
const createNewDonation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { donor_id, date, amount, purpose_id, payment_type, type } = req.body;
    if (!donor_id || !date || !amount || !purpose_id || !payment_type || !type) {
        next(apiError_1.default.missingFields([
            'donor_id',
            'date',
            'amount',
            'purpose_id',
            'payment_type',
            'type',
        ]));
        return;
    }
    const newDonation = req.body;
    return (0, donation_service_1.createDonation)(newDonation)
        .then((donation) => {
        res.status(statusCode_1.default.CREATED).send(donation);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to create donation'));
    });
});
exports.createNewDonation = createNewDonation;
const editDonation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { donation_id } = _a, restOfBody = __rest(_a, ["donation_id"]);
    (0, donation_service_1.editDonationById)(donation_id, restOfBody)
        .then((response) => res.status(statusCode_1.default.OK).send(response))
        .catch((e) => {
        console.log(e);
        next(apiError_1.default.internal('Failed to edit donation.'));
    });
});
exports.editDonation = editDonation;
const acknowledgeDonationById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        next(apiError_1.default.missingFields(['id']));
        return;
    }
    return (0, donation_service_1.acknowledgeDonation)(id)
        .then((donation) => {
        res.status(statusCode_1.default.OK).send(donation);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to acknowledge donation'));
    });
});
exports.acknowledgeDonationById = acknowledgeDonationById;
const deleteDonation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { donation_id } = req.body;
    (0, donation_service_1.deleteDonationById)(donation_id)
        .then((response) => response
        ? res.status(statusCode_1.default.OK).send(response)
        : res.sendStatus(statusCode_1.default.NOT_FOUND))
        .catch((e) => {
        console.log(e);
        next(apiError_1.default.internal('Failed to delete lesson.'));
    });
});
exports.deleteDonation = deleteDonation;
//# sourceMappingURL=donation.controller.js.map