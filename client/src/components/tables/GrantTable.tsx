import React from 'react';
import FilteringTable from './FilteringTable';

function GrantTable() {
  // Define the columns
  // <Date>, <Amount>, <Donor>, <Payment Type>, <Purpose>, <Year>
  const columns = [
    { id: 'date', label: 'Date' },
    { id: 'amount', label: 'Amount' },
    { id: 'donor_id', label: 'Donor' },
    { id: 'payment_type', label: 'Payment Type' },
    { id: 'purpose_id', label: 'Purpose' },
    { id: 'date', label: 'Year' },
    // Add more columns as needed
  ];

  // Generate the rows
  const rows = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2024-12-31');
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    rows.push({
      id: rows.length + 1,
      name: `Name ${rows.length + 1}`,
      date: d.toISOString().split('T')[0], // Format the date as 'yyyy-mm-dd'
      // Add more data as needed
    });
  }

  return <FilteringTable columns={columns} rows={rows} />;
}

export default GrantTable;
