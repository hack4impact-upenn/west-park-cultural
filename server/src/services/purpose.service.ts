import { IPurpose, Purpose } from '../models/purpose.model';

const createPurpose = async (purpose: IPurpose) => {
  const newPurpose = new Purpose(purpose);
  const result = await newPurpose.save().catch((err) => {
    console.log(err.message);
  });
  return result;
};

const getPurposeById = async (id: string) => {
  const purpose = await Purpose.findById(id).exec();
  return purpose;
};

const getAllPurposes = async () => {
  const purposes = await Purpose.find().exec();
  return purposes;
};

export { createPurpose, getPurposeById, getAllPurposes };
