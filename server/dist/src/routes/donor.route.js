"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../controllers/auth.middleware");
const donor_controller_1 = require("../controllers/donor.controller");
const router = express_1.default.Router();
router.get('/all', donor_controller_1.getAllDonorsController);
router.get('type/:type', auth_middleware_1.isAuthenticated, donor_controller_1.getAllDonorsOfType);
router.get('/id/:id', auth_middleware_1.isAuthenticated, donor_controller_1.getDonorByIdController);
router.post('/edit', auth_middleware_1.isAuthenticated, donor_controller_1.editDonor);
router.post('/updateRecent', auth_middleware_1.isAuthenticated, donor_controller_1.updateDonorRecentDonation);
router.post('/create', auth_middleware_1.isAuthenticated, donor_controller_1.createDonorController);
router.post('/note', auth_middleware_1.isAuthenticated, donor_controller_1.updateDonorNote);
exports.default = router;
//# sourceMappingURL=donor.route.js.map