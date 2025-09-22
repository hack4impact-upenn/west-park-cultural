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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPurposesController = exports.getPurposeByIdController = exports.createPurposeController = void 0;
const apiError_1 = __importDefault(require("../util/apiError"));
const statusCode_1 = __importDefault(require("../util/statusCode"));
const purpose_service_1 = require("../services/purpose.service");
const createPurposeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const purpose = req.body;
    return (0, purpose_service_1.createPurpose)(purpose)
        .then((result) => {
        res.status(statusCode_1.default.CREATED).send(result);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to create purpose'));
    });
});
exports.createPurposeController = createPurposeController;
const getPurposeByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        next(apiError_1.default.missingFields(['id']));
        return;
    }
    return (0, purpose_service_1.getPurposeById)(id)
        .then((purpose) => {
        res.status(statusCode_1.default.OK).send(purpose);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to retrieve purpose'));
    });
});
exports.getPurposeByIdController = getPurposeByIdController;
const getAllPurposesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, purpose_service_1.getAllPurposes)()
        .then((purposeList) => {
        res.status(statusCode_1.default.OK).send(purposeList);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to retrieve all purposes'));
    });
});
exports.getAllPurposesController = getAllPurposesController;
//# sourceMappingURL=purpose.controller.js.map