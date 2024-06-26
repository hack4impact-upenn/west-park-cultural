import { IReports, Reports } from '../models/reports.model';

const createReports = async (reports: IReports) => {
  const newReports = new Reports(reports);
  const result = await newReports.save().catch((err) => {
    console.log(err.message);
  });
  return result;
};

const getReportsByDate = async (date: Date) => {
  // const reports = await Reports.findById(id).exec();
  // return reports;
};

const getAllReports = async () => {
  const reports = await Reports.find().exec();
  return reports;
};

export { createReports, getReportsByDate, getAllReports };
