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
exports.getAllReports = exports.getReportsByDate = exports.createReports = void 0;
const reports_model_1 = require("../models/reports.model");
const createReports = (reports) => __awaiter(void 0, void 0, void 0, function* () {
    const newReports = new reports_model_1.Reports(reports);
    const result = yield newReports.save().catch((err) => {
        console.log(err.message);
    });
    return result;
});
exports.createReports = createReports;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getReportsByDate = (date) => __awaiter(void 0, void 0, void 0, function* () {
    // const reports = await Reports.findById(id).exec();
    // return reports;
});
exports.getReportsByDate = getReportsByDate;
const getAllReports = () => __awaiter(void 0, void 0, void 0, function* () {
    const reports = yield reports_model_1.Reports.find().exec();
    return reports;
});
exports.getAllReports = getAllReports;
//# sourceMappingURL=reports.service.js.map