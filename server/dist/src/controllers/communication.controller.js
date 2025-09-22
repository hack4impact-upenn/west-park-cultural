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
exports.getAllCommunicationsController = exports.getCommunicationByIdController = exports.createCommunicationController = void 0;
const apiError_1 = __importDefault(require("../util/apiError"));
const statusCode_1 = __importDefault(require("../util/statusCode"));
const communication_service_1 = require("../services/communication.service");
const createCommunicationController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const communication = req.body;
    return (0, communication_service_1.createCommunication)(communication)
        .then((result) => {
        res.status(statusCode_1.default.CREATED).send(result);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to create communication'));
    });
});
exports.createCommunicationController = createCommunicationController;
const getCommunicationByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        next(apiError_1.default.missingFields(['id']));
        return;
    }
    return (0, communication_service_1.getCommunicationById)(id)
        .then((communication) => {
        res.status(statusCode_1.default.OK).send(communication);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to retrieve communication'));
    });
});
exports.getCommunicationByIdController = getCommunicationByIdController;
const getAllCommunicationsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, communication_service_1.getAllCommunications)()
        .then((communicationList) => {
        res.status(statusCode_1.default.OK).send(communicationList);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to retrieve all communications'));
    });
});
exports.getAllCommunicationsController = getAllCommunicationsController;
//# sourceMappingURL=communication.controller.js.map