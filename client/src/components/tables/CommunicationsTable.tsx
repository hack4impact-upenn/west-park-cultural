import React from 'react';
import FilteringTable from './FilteringTable';

function CommunicationsTable() {
  // // Define the columns
  // // <Date>, <# of Recipients>, <Recipient List>, <Added Groups>
  // const columns = [
  //   { id: 'date_created', label: 'Date' },
  //   { id: 'donor_ids', label: '# of Recipients' },
  //   { id: 'donor_ids', label: 'Recipient List' },
  //   { id: 'group_name', label: 'Added Groups' },
  //   // Add more columns as needed
  // ];

  // // Generate the rows
  // const rows = [];
  // const startDate = new Date('2023-01-01');
  // const endDate = new Date('2024-12-31');
  // for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
  //   rows.push({
  //     id: rows.length + 1,
  //     name: `Name ${rows.length + 1}`,
  //     date: d.toISOString().split('T')[0], // Format the date as 'yyyy-mm-dd'
  //     // Add more data as needed
  //   });
  // }

  // return <FilteringTable columns={columns} rows={rows} />;
}

export default CommunicationsTable;
