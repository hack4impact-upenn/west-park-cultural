import { Donation, IDonation } from '../models/donation.model';

const getAll = async () => {
  const donations = await Donation.find().exec();
  return donations;
};

const getAllDonationsOfTypeDonation = async () => {
  const donations = await Donation.find({ type: 'donation' }).exec();
  return donations;
};

const getAllDonationsOfTypeSponsorship = async () => {
  const donations = await Donation.find({ type: 'sponsorship' }).exec();
  return donations;
};

const getAllDonationsOfTypeGrant = async () => {
  const donations = await Donation.find({ type: 'grant' }).exec();
  return donations;
};

const getDonationById = async (id: string) => {
  const donation = await Donation.findById(id).exec();
  return donation;
};

const getAllDonationsbyDonorId = async (donorId: string) => {
  const donations = await Donation.find({ donor_id: donorId }).exec();
  return donations;
};

const createDonation = async (donation: IDonation) => {
  const newDonation = new Donation(donation);
  const result = await newDonation.save();
  return result;
};

const acknowledgeDonation = async (id: string) => {
  const donation = await Donation.findById(id).exec();
  if (donation) {
    donation.acknowledged = true;
    const result = await donation.save();
    return result;
  }
  return null;
};

const editDonationById = async (
  donationId: string,
  newDonationInfo: IDonation,
) => {
  try {
    const donation = await Donation.updateOne(
      { donationId },
      newDonationInfo,
    ).exec();
    return donation;
  } catch (error) {
    throw new Error('Error updating donation');
  }
};

const deleteDonationById = async (id: string) => {
  try {
    const donation = await Donation.findByIdAndDelete(id).exec();
    return donation;
  } catch (error) {
    throw new Error('Error deleting lesson');
  }
};

export {
  getAll,
  getAllDonationsOfTypeDonation,
  getAllDonationsOfTypeSponsorship,
  getAllDonationsOfTypeGrant,
  getDonationById,
  getAllDonationsbyDonorId,
  createDonation,
  acknowledgeDonation,
  editDonationById,
  deleteDonationById,
};
