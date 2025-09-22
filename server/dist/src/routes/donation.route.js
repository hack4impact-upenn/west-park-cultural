"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../controllers/auth.middleware");
const donation_controller_1 = require("../controllers/donation.controller");
const router = express_1.default.Router();
router.get('/all', auth_middleware_1.isAuthenticated, donation_controller_1.getAllDonations);
router.get('/type/:type', auth_middleware_1.isAuthenticated, donation_controller_1.getAllDonationsOfType);
router.get('/:id', auth_middleware_1.isAuthenticated, donation_controller_1.getDonation);
router.get('/donor/:id', auth_middleware_1.isAuthenticated, donation_controller_1.getDonationsByDonorId);
// router.post('/new', isAuthenticated, createNewDonation);
// For testing:
router.post('/new', auth_middleware_1.isAuthenticated, donation_controller_1.createNewDonation);
// router.post('/edit', isAuthenticated, editDonation);
router.post('/edit', auth_middleware_1.isAuthenticated, donation_controller_1.editDonation);
router.put('/acknowledge/:id', auth_middleware_1.isAuthenticated, donation_controller_1.acknowledgeDonationById);
router.post('/delete', auth_middleware_1.isAuthenticated, donation_controller_1.deleteDonation);
exports.default = router;
//# sourceMappingURL=donation.route.js.map