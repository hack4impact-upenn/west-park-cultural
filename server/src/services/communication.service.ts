import { ICommunication, Communication } from '../models/communication.model';

const createCommunication = async (communication: ICommunication) => {
  const newCommunication = new Communication(communication);
  const result = await newCommunication.save();
  return result;
};

const getCommunicationById = async (id: string) => {
  const communication = await Communication.findById(id).exec();
  return communication;
};

const getAllCommunications = async () => {
  const communications = await Communication.find().exec();
  return communications;
};

export { createCommunication, getCommunicationById, getAllCommunications };
