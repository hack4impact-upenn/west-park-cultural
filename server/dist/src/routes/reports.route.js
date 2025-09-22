"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../controllers/auth.middleware");
const reports_controller_1 = require("../controllers/reports.controller");
const router = express_1.default.Router();
router.get('/all', reports_controller_1.getAllReportsController);
router.post('/create', auth_middleware_1.isAuthenticated, reports_controller_1.createReportsController); //overwrite existing if same day
exports.default = router;
//# sourceMappingURL=reports.route.js.map