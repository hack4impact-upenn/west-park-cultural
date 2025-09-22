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
exports.updateDonorRecentDonation = exports.updateDonorNote = exports.editDonor = exports.getDonorByIdController = exports.createDonorController = exports.getAllDonorsOfType = exports.getAllDonorsController = void 0;
const apiError_1 = __importDefault(require("../util/apiError"));
const statusCode_1 = __importDefault(require("../util/statusCode"));
const donor_service_1 = require("../services/donor.service");
const getAllDonorsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, donor_service_1.getAllDonors)()
        .then((donorList) => {
        res.status(statusCode_1.default.OK).send(donorList);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to retrieve all donors'));
    });
});
exports.getAllDonorsController = getAllDonorsController;
const getAllDonorsOfType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    if (!type) {
        next(apiError_1.default.missingFields(['type']));
        return;
    }
    if (type === 'donor') {
        return (0, donor_service_1.getAllDonorsTypeDonor)()
            .then((donorList) => {
            res.status(statusCode_1.default.OK).send(donorList);
        })
            .catch(() => {
            next(apiError_1.default.internal('Unable to retrieve all donors of type donor'));
        });
    }
    if (type === 'sponsor') {
        return (0, donor_service_1.getAllDonorsTypeSponsor)()
            .then((donorList) => {
            res.status(statusCode_1.default.OK).send(donorList);
        })
            .catch(() => {
            next(apiError_1.default.internal('Unable to retrieve all donors of type sponsor'));
        });
    }
    if (type === 'grant') {
        return (0, donor_service_1.getAllDonorsTypeGrant)()
            .then((donorList) => {
            res.status(statusCode_1.default.OK).send(donorList);
        })
            .catch(() => {
            next(apiError_1.default.internal('Unable to retrieve all donors of type grant'));
        });
    }
    //   next(ApiError.invalidFields(['type']));
});
exports.getAllDonorsOfType = getAllDonorsOfType;
const createDonorController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const donor = req.body;
    console.log(req.body);
    if (!donor) {
        next(apiError_1.default.missingFields(['donor']));
        return;
    }
    return (0, donor_service_1.createDonor)(donor)
        .then((results) => {
        res.status(statusCode_1.default.OK).send(results);
    })
        .catch((e) => {
        console.log('unable to create donor error', e.message);
        next(apiError_1.default.internal('Unable to create donor'));
    });
});
exports.createDonorController = createDonorController;
const getDonorByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        next(apiError_1.default.missingFields(['id']));
        return;
    }
    return (0, donor_service_1.getDonorById)(id)
        .then((donor) => {
        res.status(statusCode_1.default.OK).send(donor);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to retrieve donor by id'));
    });
});
exports.getDonorByIdController = getDonorByIdController;
const editDonor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line camelcase
    const _a = req.body, { donor_id } = _a, restOfBody = __rest(_a, ["donor_id"]);
    (0, donor_service_1.editDonorById)(donor_id, restOfBody)
        .then((response) => res.status(statusCode_1.default.OK).send(response))
        .catch((e) => {
        console.log(e);
        next(apiError_1.default.internal('Failed to edit donation.'));
    });
});
exports.editDonor = editDonor;
const updateDonorRecentDonation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line camelcase
    const { id, last_donation_date } = req.body;
    if (!id) {
        next(apiError_1.default.missingFields(['id']));
        return;
    }
    // eslint-disable-next-line camelcase
    if (!last_donation_date) {
        next(apiError_1.default.missingFields(['last_donation_date']));
        return;
    }
    const donor = (0, donor_service_1.updateRecentDonationDate)(id, last_donation_date);
    res.status(statusCode_1.default.OK).send(donor);
});
exports.updateDonorRecentDonation = updateDonorRecentDonation;
const updateDonorNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, note } = req.body;
    if (!id) {
        next(apiError_1.default.missingFields(['id']));
        return;
    }
    if (!note) {
        next(apiError_1.default.missingFields(['note']));
        return;
    }
    const donor = (0, donor_service_1.updateNote)(id, note);
    res.status(statusCode_1.default.OK).send(donor);
});
exports.updateDonorNote = updateDonorNote;
//# sourceMappingURL=donor.controller.js.map