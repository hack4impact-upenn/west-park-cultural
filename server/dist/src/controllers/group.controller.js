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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editGroupController = exports.getAllGroupsController = exports.getCommunicationGroupByIdController = exports.createCommunicationGroupController = void 0;
const apiError_1 = __importDefault(require("../util/apiError"));
const statusCode_1 = __importDefault(require("../util/statusCode"));
const group_service_1 = require("../services/group.service");
const getAllGroupsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, group_service_1.getAllGroups)()
        .then((list) => {
        res.status(statusCode_1.default.OK).send(list);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to retrieve all groups'));
    });
});
exports.getAllGroupsController = getAllGroupsController;
const createCommunicationGroupController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const group = req.body;
    return (0, group_service_1.createCommunicationGroup)(group)
        .then((result) => {
        res.status(statusCode_1.default.CREATED).send(result);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to create communication group'));
    });
});
exports.createCommunicationGroupController = createCommunicationGroupController;
const getCommunicationGroupByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        next(apiError_1.default.missingFields(['id']));
        return;
    }
    return (0, group_service_1.getCommunicationGroupById)(id)
        .then((group) => {
        res.status(statusCode_1.default.OK).send(group);
    })
        .catch(() => {
        next(apiError_1.default.internal('Unable to retrieve communication group'));
    });
});
exports.getCommunicationGroupByIdController = getCommunicationGroupByIdController;
const editGroupController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line camelcase
    const _a = req.body, { _id } = _a, restOfBody = __rest(_a, ["_id"]);
    (0, group_service_1.editGroupById)(_id, restOfBody)
        .then((response) => res.status(statusCode_1.default.OK).send(response))
        .catch((e) => {
        console.log(e);
        next(apiError_1.default.internal('Failed to edit group.'));
    });
});
exports.editGroupController = editGroupController;
//# sourceMappingURL=group.controller.js.map