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

export {
  getAllDonors,
  getAllDonorsTypeDonor,
  getAllDonorsTypeSponsor,
  getAllDonorsTypeGrant,
  createDonor,
  getDonorById,
};
