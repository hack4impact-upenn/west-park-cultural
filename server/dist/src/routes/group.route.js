"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../controllers/auth.middleware");
const group_controller_1 = require("../controllers/group.controller");
const router = express_1.default.Router();
router.get('/all', group_controller_1.getAllGroupsController);
router.post('/create', auth_middleware_1.isAuthenticated, group_controller_1.createCommunicationGroupController);
router.post('/edit', auth_middleware_1.isAuthenticated, group_controller_1.editGroupController);
router.get('/:id', auth_middleware_1.isAuthenticated, group_controller_1.getCommunicationGroupByIdController);
exports.default = router;
//# sourceMappingURL=group.route.js.map