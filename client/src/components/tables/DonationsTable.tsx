/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useData } from '../../util/api';
import FilteringTable from './FilteringTable';

interface BasicTableProps {
  alignment: string;
  onFilteredDataChange?: (data: any[]) => void;
}

function DonationsTable({ alignment, onFilteredDataChange }: BasicTableProps) {
  const donors = useData('donor/all');
  const donations = useData('donation/all');
  const purposes = useData('purpose/all');
  const [donationsData, setDonationsData] = useState<any>([]);
  const donorIdToName: Map<string, string> = new Map();
  const purposeIdToName: Map<string, string> = new Map();
  useEffect(() => {
    const donorData = donors?.data || [];
    const data = donations?.data || [];
    const purposeData = purposes?.data || [];

    donorData.forEach((donor: any) => {
      // eslint-disable-next-line no-underscore-dangle
      donorIdToName.set(donor._id, donor.contact_name);
    });

    purposeData.forEach((purpose: any) => {
      // eslint-disable-next-line no-underscore-dangle
      purposeIdToName.set(purpose._id, purpose.name);
    });

    const filteredData = data
      .filter(
        (donation: any) => donation.type === alignment || alignment === 'all',
      )
      .map((donation: any) => ({
        ...donation,
        donor_name: donorIdToName.get(donation.donor_id),
        purpose_name:
          purposeIdToName.get(donation.purpose_id) || 'No Purpose (General)',
      }))
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      ); // Sort by date, newest first
    setDonationsData(filteredData);
    if (onFilteredDataChange) {
      onFilteredDataChange(filteredData);
    }
  }, [
    donations?.data,
    donors?.data,
    purposes?.data,
    alignment,
    onFilteredDataChange,
  ]);

  // columns: <Date>, <Amount>, <Donor>, <Payment Type>, <Purpose>
  const columns = [
    { id: 'date', label: 'Date' },
    { id: 'amount', label: 'Amount' },
    { id: 'donor_id', label: 'Donor' },
    { id: 'payment_type', label: 'Payment Type' },
    { id: 'purpose_name', label: 'Purpose' },
    { id: 'acknowledged', label: 'Acknowledged' },
    { id: 'more', label: 'More Information' },
  ];

  const rows: any = [];
  donationsData.forEach((donation: any, index: number) => {
    rows.push({
      id: donation._id, // Use the actual donation ID instead of index
      date: new Date(donation.date).toISOString().split('T')[0],
      amount: donation.amount,
      donor_id: (
        <a
          href={`/donor-profile/${donation.donor_id}`}
          style={{ textDecoration: 'none', color: '#0883ff' }}
        >
          {donation.donor_name}
        </a>
      ),
      payment_type: donation.payment_type,
      purpose_id: donation.purpose_id, // Keep the raw ID for filtering
      purpose_name: <span>{donation.purpose_name}</span>, // Display name in a separate column
      acknowledged: (
        <span
          style={{
            color: donation.acknowledged ? 'green' : 'red',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {donation.acknowledged ? 'Yes' : 'No'}
        </span>
      ),
      more: (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <a
            href={`donationInfo/${donation._id}`}
            style={{ textDecoration: 'none', color: '#0883ff' }}
          >
            View
          </a>
        </div>
      ),
    });
  });

  return (
    <FilteringTable
      columns={columns}
      rows={rows}
      showAll={alignment === 'all'}
      onFilteredDataChange={onFilteredDataChange}
    />
  );
}

export default DonationsTable;
