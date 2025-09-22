"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../controllers/auth.middleware");
const communication_controller_1 = require("../controllers/communication.controller");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.isAuthenticated, communication_controller_1.createCommunicationController);
router.get('/:id', auth_middleware_1.isAuthenticated, communication_controller_1.getCommunicationByIdController);
router.get('/', auth_middleware_1.isAuthenticated, communication_controller_1.getAllCommunicationsController);
exports.default = router;
//# sourceMappingURL=communication.route.js.map