import { Donor, IDonor } from '../models/donor.model';

const getAllDonors = async () => {
  const donors = await Donor.find().exec();
  return donors;
};

const getAllDonorsTypeDonor = async () => {
  const donors = await Donor.find({ type: 'donor' }).exec();
  return donors;
};

const getAllDonorsTypeSponsor = async () => {
  const donors = await Donor.find({ type: 'sponsor' }).exec();
  return donors;
};

const getAllDonorsTypeGrant = async () => {
  const donors = await Donor.find({ type: 'grant' }).exec();
  return donors;
};

const createDonor = async (donor: IDonor) => {
  const newDonor = new Donor(donor);
  const result = await newDonor.save();
  return result;
};

const getDonorById = async (id: string) => {
  const donor = await Donor.findById(id).exec();
  return donor;
};

const editDonorById = async (_id: string, newDonorInfo: IDonor) => {
  try {
    const donor = await Donor.updateOne({ _id }, newDonorInfo).exec();
    return donor;
  } catch (error) {
    throw new Error('Error updating donation');
  }
};

const updateNote = async (id: string, note: string) => {
  try {
    const donor = await Donor.findOneAndUpdate(
      { _id: id },
      { $set: { [`note`]: note } }, // Update the 'note' field with the new value
      { new: true },
    ).exec();
    return donor;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  getAllDonors,
  getAllDonorsTypeDonor,
  getAllDonorsTypeSponsor,
  getAllDonorsTypeGrant,
  createDonor,
  getDonorById,
  editDonorById,
  updateNote,
};
