interface IDonation {
    _id: string;
    type: string;
    payment_type: string;
    grant_year: string;
    date: Date;
    amount: number;
    acknowledged: boolean;
    donor_id: string;
    purpose_id: string;
    comments: string;
  }
  
  export default IDonation;
  