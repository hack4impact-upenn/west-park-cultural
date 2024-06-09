import React from 'react';
import FilteringTable from './FilteringTable';

function DonorsTable() {
  // Define the columns
  // <Name>, <Donor Group>, <Recent Donation>, <Last Communication>
  // const columns = [
  //   { id: 'contact_name', label: 'Name' },
  //   { id: 'donor_group', label: 'Donor Group' },
  //   { id: 'last_donation_date', label: 'Recent Donation' },
  //   { id: 'last_communication_date', label: 'Last Communication' },
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

export default DonorsTable;
