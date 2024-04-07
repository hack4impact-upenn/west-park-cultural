import React, { useState, useEffect } from 'react';
import { useData } from '../../util/api';
import FilteringTable from './FilteringTable';

interface BasicTableProps {
  alignment: string;
}

function DonationsTable({ alignment }: BasicTableProps) {
  const donations = useData('donation/all');
  const [donationsData, setDonationsData] = useState<any>([]);

  useEffect(() => {
    const data = donations?.data || [];
    setDonationsData(data);
  }, [donations?.data]);

  // columns: <Date>, <Amount>, <Donor>, <Payment Type>, <Purpose>
  const columns = [
    { id: 'date', label: 'Date' },
    { id: 'amount', label: 'Amount' },
    { id: 'donor_id', label: 'Donor' },
    { id: 'payment_type', label: 'Payment Type' },
    { id: 'purpose_id', label: 'Purpose' },
  ];

  // const rows = donationsData.map((donation: any) => ({
  //   date: new Date(donation.date).toISOString().split('T')[0],
  //   amount: donation.amount,
  //   donor_id: donation.donor_id,
  //   payment_type: donation.payment_type,
  //   purpose_id: donation.purpose_id,
  // }));

  const rows: any = [];
  donationsData.forEach((donation : any, index : number) => {
    rows.push({
      id: index + 1,
      date: new Date(donation.date).toISOString().split('T')[0],
      amount: donation.amount,
      donor_id: donation.donor_id,
      payment_type: donation.payment_type,
      purpose_id: donation.purpose_id,
    });
  });

  return <FilteringTable columns={columns} rows={rows} />;
}

export default DonationsTable;
