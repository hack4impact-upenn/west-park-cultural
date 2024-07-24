import React, { useEffect, useState } from 'react';
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
  Grid,
  Popover,
  Box,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Chip from '@mui/material/Chip';
import { getData, useData } from '../../util/api';
import './table.css';

interface Column {
  id: string;
  label: string;
}

// interface Row {
//   [key: string]: number | string;
//   date: string;
//   amount: number;
//   donor_id: string;
//   payment_type: string;
//   purpose_id: string;
// }
interface Row {
  [key: string]: number | string;
  contact_name: string;
  donor_group: number;
  last_donation_date: string;
  last_communication_date: string;
}
interface FilteringTableProps {
  columns: Column[];
  rows: Row[];
  showAll?: boolean;
}

function FilteringTable({
  columns: initialColumns,
  rows: initialRows,
  showAll: showAllRows,
}: FilteringTableProps) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [filterType, setFilterType] = useState('calendar');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterVisible, setFilterVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(showAllRows ? 25 : 10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRows, setFilteredRows] = useState<Row[]>([]);

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

  const filterRows = (searchedRows: Row[]) => {
    // Then apply the year filter
    const filteredRowsCur = searchedRows.filter((row) => {
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
    setFilteredRows(searchedRows);
  };

  function searchRows() {
    // Apply the search filter first
    const searchedRows = initialRows.filter((row) => {
      // Convert all row values to string and lowercase, then check if they include the search term
      return Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm),
      );
    });
    filterRows(searchedRows);
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0); // Reset to the first page when the search term changes
    searchRows();
  };

  useEffect(() => {
    searchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRows, rows]);

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    toggleFilterVisible();
  };

  const closePopover = () => {
    setAnchorEl(null);
    toggleFilterVisible();
  };

  const [purposes, setPurposesFilter] = React.useState<string[]>([]);
  const hanldlePurposesChange = (event: SelectChangeEvent<typeof purposes>) => {
    const {
      target: { value },
    } = event;
    setPurposesFilter(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <TableContainer
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
        maxWidth: '100%',
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
      <IconButton
        onClick={openPopover}
        style={{ margin: '20px' }}
        aria-describedby="filterBtn"
      >
        <FilterAltIcon />
      </IconButton>
      {filterVisible && (
        <Popover
          open={filterVisible}
          id="filterBtn"
          anchorEl={anchorEl}
          onClose={closePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <div className="filtersWrapper">
            <span className="filterwrapperTitle">Filter Donations</span>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div className="filterParent">
                  <span className="filterHeader">Date</span>
                  <div className="filterInner">
                    <Select
                      value={filterType}
                      onChange={handleFilterTypeChange}
                    >
                      <MenuItem value="all">All Time</MenuItem>
                      <MenuItem value="calendar">Calendar Year</MenuItem>
                      <MenuItem value="fiscal">Fiscal Year</MenuItem>
                      <MenuItem value="ninty">Last 90 Days</MenuItem>
                      <MenuItem value="thirty">Last 30 Days</MenuItem>
                      <MenuItem value="custom">Custom Range</MenuItem>
                    </Select>
                    <TextField
                      label="Year"
                      value={filterYear}
                      onChange={handleFilterYearChange}
                      style={{ marginLeft: '10px' }}
                    />
                  </div>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="filterParent">
                  <div className="filterHeader">Amount</div>
                  <Grid container spacing={8}>
                    <Grid item xs={4}>
                      <Select defaultValue="all" className="fitlerSelect">
                        <MenuItem value="all">All Amounts</MenuItem>
                        <MenuItem value="between">Between</MenuItem>
                        <MenuItem value="between">More than</MenuItem>
                        <MenuItem value="between">Less than</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={6}>
                      <div className="rangeParent">
                        <TextField
                          label="Min"
                          onChange={handleFilterYearChange}
                          className="rangeInput"
                        />
                        <div className="dash">{}</div>
                        <TextField
                          label="Max"
                          onChange={handleFilterYearChange}
                          className="rangeInput"
                        />
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="filterParent">
                  <div className="filterHeader">Purpose</div>
                  <Grid container spacing={8}>
                    <Grid item xs={12}>
                      <Select
                        className="filterChooseMultiple"
                        multiple
                        onChange={hanldlePurposesChange}
                        value={purposes}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {selected.map((value: any) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                      >
                        <MenuItem value="all">All Purposes</MenuItem>
                        <MenuItem value="between">Between</MenuItem>
                        <MenuItem value="between">More than</MenuItem>
                        <MenuItem value="between">Less than</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '20px',
              }}
            >
              <Button variant="outlined">Cancel</Button>
              <Button variant="contained" color="primary">
                Confirm
              </Button>
            </Box>
          </div>
        </Popover>
      )}
      {initialRows.length === 0 && (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>No Results</div>
        </div>
      )}
      {initialRows.length > 0 && (
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
          <TableFooter style={{ overflow: 'visible' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              style={{ overflow: 'visible' }}
            />
          </TableFooter>
        </Table>
      )}
    </TableContainer>
  );
}

export default FilteringTable;
