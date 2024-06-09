interface IDonor {
  _id: string;
  contact_name: string;
  contact_email: string;
  contact_address: string;
  contact_phone: string;
  org_name: string;
  org_email: string;
  org_address: string;
  donor_group: string;
  registered_date: Date;
  last_donation_date: Date;
  last_communication_date: Date;
  type: string;
  comments: string;
  note: string;
}

export default IDonor;
