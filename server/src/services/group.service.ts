import { IGroup, Group } from '../models/group.model';

const getAllGroups = async () => {
  const groups = await Group.find().exec();
  return groups;
};

const createCommunicationGroup = async (group: IGroup) => {
  const newGroup = new Group(group);
  const result = await newGroup.save();
  return result;
};

const getCommunicationGroupById = async (id: string) => {
  const group = await Group.findById(id).exec();
  return group;
};

export { createCommunicationGroup, getCommunicationGroupById, getAllGroups };