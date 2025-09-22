"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const purpose_controller_1 = require("../controllers/purpose.controller");
const router = express_1.default.Router();
// router.post('/', isAuthenticated, createPurposeController);
// For testing:
router.post('/', purpose_controller_1.createPurposeController);
router.get('/all', purpose_controller_1.getAllPurposesController);
// // router.get('/:id', isAuthenticated, getPurposeByIdController);
router.get('/:id', purpose_controller_1.getPurposeByIdController);
router.get('/', purpose_controller_1.getAllPurposesController);
exports.default = router;
//# sourceMappingURL=purpose.route.js.map