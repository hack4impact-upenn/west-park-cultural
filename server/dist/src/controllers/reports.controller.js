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
exports.createReportsController = exports.getAllReportsController = void 0;
const apiError_1 = __importDefault(require("../util/apiError"));
const statusCode_1 = __importDefault(require("../util/statusCode"));
const reports_service_1 = require("../services/reports.service");
const getAllReportsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, reports_service_1.getAllReports)()
        .then((reportsList) => {
        res.status(statusCode_1.default.OK).send(reportsList);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to retrieve all purposes'));
    });
});
exports.getAllReportsController = getAllReportsController;
const createReportsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reports = req.body;
    return (0, reports_service_1.createReports)(reports)
        .then((result) => {
        res.status(statusCode_1.default.CREATED).send(result);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to create purpose'));
    });
});
exports.createReportsController = createReportsController;
//# sourceMappingURL=reports.controller.js.map