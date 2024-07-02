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

const editGroupById = async (_id: string, newGroupInfo: IGroup) => {
  try {
    const group = await Group.updateOne({ _id }, newGroupInfo).exec();
    return group;
  } catch (error) {
    throw new Error('Error updating group');
  }
};

export {
  createCommunicationGroup,
  getCommunicationGroupById,
  getAllGroups,
  editGroupById,
};
