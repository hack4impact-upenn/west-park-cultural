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
exports.editGroupById = exports.getAllGroups = exports.getCommunicationGroupById = exports.createCommunicationGroup = void 0;
const group_model_1 = require("../models/group.model");
const getAllGroups = () => __awaiter(void 0, void 0, void 0, function* () {
    const groups = yield group_model_1.Group.find().exec();
    return groups;
});
exports.getAllGroups = getAllGroups;
const createCommunicationGroup = (group) => __awaiter(void 0, void 0, void 0, function* () {
    const newGroup = new group_model_1.Group(group);
    const result = yield newGroup.save();
    return result;
});
exports.createCommunicationGroup = createCommunicationGroup;
const getCommunicationGroupById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield group_model_1.Group.findById(id).exec();
    return group;
});
exports.getCommunicationGroupById = getCommunicationGroupById;
const editGroupById = (_id, newGroupInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield group_model_1.Group.updateOne({ _id }, newGroupInfo).exec();
        return group;
    }
    catch (error) {
        throw new Error('Error updating group');
    }
});
exports.editGroupById = editGroupById;
//# sourceMappingURL=group.service.js.map