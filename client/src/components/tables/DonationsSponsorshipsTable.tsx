import React, { useState, useEffect } from 'react';
import FilteringTable from './FilteringTable';

function DonationsSponsorshipsTable() {
  const [rows, setRows] = useState([]); // State to store the fetched rows

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the backend route using the native fetch API
        const response = await fetch('/all'); // Assuming your backend route is /api/donors/type/sponsor
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setRows(data); // Update the state with the fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts

    // Clean up function to cancel any ongoing requests
    return () => {
      // You can cancel any ongoing requests here if needed
    };
  }, []); // Empty dependency array ensures that this effect runs only once

  // Define the columns
  const columns = [
    { id: 'date', label: 'Date' },
    { id: 'amount', label: 'Amount' },
    { id: 'donor_id', label: 'Donor' },
    { id: 'payment_type', label: 'Payment Type' },
    { id: 'purpose_id', label: 'Purpose' },
    // Add more columns as needed
  ];

  return <FilteringTable columns={columns} rows={rows} />;
}

export default DonationsSponsorshipsTable;
