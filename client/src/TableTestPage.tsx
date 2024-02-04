import React from 'react';
import FilteringTable from './components/FilteringTable';

function TableTestPage() {
  // Define the columns
  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'date', label: 'Date' },
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

export default TableTestPage;
