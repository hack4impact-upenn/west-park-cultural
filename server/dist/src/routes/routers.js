"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_route_1 = __importDefault(require("./admin.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const donation_route_1 = __importDefault(require("./donation.route"));
const donor_route_1 = __importDefault(require("./donor.route"));
const group_route_1 = __importDefault(require("./group.route"));
const purpose_route_1 = __importDefault(require("./purpose.route"));
const communication_route_1 = __importDefault(require("./communication.route"));
const reports_route_1 = __importDefault(require("./reports.route"));
const prefixToRouterMap = [
    {
        prefix: '/api/auth',
        router: auth_route_1.default,
    },
    {
        prefix: '/api/admin',
        router: admin_route_1.default,
    },
    {
        prefix: '/api/donation',
        router: donation_route_1.default,
    },
    {
        prefix: '/api/donor',
        router: donor_route_1.default,
    },
    {
        prefix: '/api/group',
        router: group_route_1.default,
    },
    {
        prefix: '/api/purpose',
        router: purpose_route_1.default,
    },
    {
        prefix: '/api/communication',
        router: communication_route_1.default,
    },
    {
        prefix: '/api/reports',
        router: reports_route_1.default,
    },
];
exports.default = prefixToRouterMap;
//# sourceMappingURL=routers.js.map