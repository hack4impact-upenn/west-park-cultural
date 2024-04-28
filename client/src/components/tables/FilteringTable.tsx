import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableFooter,
  TableRow,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  Input,
  SelectChangeEvent,
  Link,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { getData, useData } from '../../util/api';

interface Column {
  id: string;
  label: string;
}

interface Row {
  [key: string]: number | string;
  date: string;
  amount: number;
  donor_id: string;
  payment_type: string;
  purpose_id: string;
}

interface FilteringTableProps {
  columns: Column[];
  rows: Row[];
}

function FilteringTable({
  columns: initialColumns,
  rows: initialRows,
}: FilteringTableProps) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [filterType, setFilterType] = useState('calendar');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterVisible, setFilterVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterTypeChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value);
  };

  const handleFilterYearChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFilterYear(parseInt(event.target.value, 10));
  };

  const toggleFilterVisible = () => {
    setFilterVisible(!filterVisible);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0); // Reset to the first page when the search term changes
  };

  // Apply the search filter first
  const searchedRows = initialRows.filter((row) => {
    // Convert all row values to string and lowercase, then check if they include the search term
    return Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm),
    );
  });

  // Then apply the year filter
  const filteredRows = searchedRows.filter((row) => {
    const date = new Date(row.date as string);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (filterType === 'calendar') {
      return year === filterYear;
    }
    // fiscal year
    return (
      (month >= 6 && year === filterYear) ||
      (month < 6 && year - 1 === filterYear)
    );
  });

  return (
    <>
      {/* {filterVisible && (
        <>
          <Select value={filterType} onChange={handleFilterTypeChange}>
            <MenuItem value="calendar">Calendar Year</MenuItem>
            <MenuItem value="fiscal">Fiscal Year</MenuItem>
          </Select>
          <TextField
            label="Year"
            value={filterYear}
            onChange={handleFilterYearChange}
          />
        </>
      )} */}

      <TableContainer
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
          maxWidth: '95%',
          margin: 'auto',
          padding: '20px',
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          onChange={handleSearchChange}
          style={{ margin: '10px', width: `calc(100% / 4` }}
        />
        <IconButton onClick={toggleFilterVisible} style={{ margin: '20px' }}>
          <FilterAltIcon />
        </IconButton>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ width: `calc(100% / ${columns.length})` }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{row[column.id]}</TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}

export default FilteringTable;
