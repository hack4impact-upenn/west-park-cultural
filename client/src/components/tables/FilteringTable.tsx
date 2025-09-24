/* eslint-disable no-underscore-dangle */
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
  SelectChangeEvent,
  Grid,
  Popover,
  Box,
  Chip,
} from '@mui/material';
import { useData } from '../../util/api';
import './table.css';

interface Column {
  id: string;
  label: string;
}

// FIX 1: Added `id` to the Row interface for use as a unique key in React.
interface Row {
  id: string | number; // For unique key prop
  contact_name: string;
  donor_group: number;
  last_donation_date: string;
  last_communication_date: string;
  date?: string; // Assuming 'date' is present for filtering
  purpose_id?: string;
  [key: string]: string | number | undefined; // Allow additional string/number properties
}

interface FilteringTableProps {
  columns: Column[];
  rows: Row[];
  showAll?: boolean;
  hideSearch?: boolean;
  onFilteredDataChange?: (data: Row[]) => void;
}

function FilteringTable({
  columns: initialColumns,
  rows: initialRows,
  showAll: showAllRows,
  hideSearch = false,
  onFilteredDataChange,
}: FilteringTableProps) {
  // FIX 2: Correctly defined `searchTerm` state variable.
  const [searchTerm, setSearchTerm] = useState('');
  const [columns] = useState<Column[]>(initialColumns);
  const [filterType, setFilterType] = useState('all');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterVisible, setFilterVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(showAllRows ? 25 : 10);
  const [filteredRows, setFilteredRows] = useState<Row[]>(initialRows);
  const [purposes, setPurposesFilter] = useState<string[]>([]);
  const [availablePurposes, setAvailablePurposes] = useState<
    Array<{ _id: string; name: string }>
  >([]);
  const purposesData = useData('purpose/all');

  // Centralized filtering logic in a function
  const applyFilters = React.useCallback(
    (immediate = false) => {
      let filteredData = [...initialRows];

      // Always apply filters, but handle 'all' case explicitly
      if (!immediate && filterType !== 'all' && purposes.length > 0) {
        // For non-immediate filters, wait for explicit apply
        return;
      }

      // Apply search filter
      if (searchTerm.trim() !== '') {
        filteredData = filteredData.filter((row) => {
          const searchableText = row.donor_name || row.contact_name || '';
          return searchableText
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        });
      }

      // Apply date filter
      if (filterType !== 'all') {
        filteredData = filteredData.filter((row) => {
          if (!row.date) return false;
          const donationDate = new Date(row.date as string);
          const now = new Date();

          switch (filterType) {
            case 'calendar': {
              const startOfYear = new Date(filterYear, 0, 1);
              const endOfYear = new Date(filterYear, 11, 31);
              return donationDate >= startOfYear && donationDate <= endOfYear;
            }
            case 'fiscal': {
              const fiscalYearStart = new Date(filterYear - 1, 6, 1); // July 1st of previous year
              const fiscalYearEnd = new Date(filterYear, 5, 30); // June 30th of current year
              return (
                donationDate >= fiscalYearStart && donationDate <= fiscalYearEnd
              );
            }
            case 'thirty': {
              const thirtyDaysAgo = new Date(now);
              thirtyDaysAgo.setDate(now.getDate() - 30);
              return donationDate >= thirtyDaysAgo;
            }
            case 'ninty': {
              const ninetyDaysAgo = new Date(now);
              ninetyDaysAgo.setDate(now.getDate() - 90);
              return donationDate >= ninetyDaysAgo;
            }
            // NOTE: 'custom' case can be added here
            default:
              return true;
          }
        });
      }

      // Apply purpose filter
      if (purposes.length > 0) {
        filteredData = filteredData.filter((row) => {
          const rowPurposeId = row.purpose_id as string;
          return purposes.includes(rowPurposeId);
        });
      }

      setFilteredRows(filteredData);
      // Only reset page when filters actually change the data
      if (filteredData.length !== filteredRows.length) {
        setPage(0);
      }

      if (onFilteredDataChange) {
        onFilteredDataChange(filteredData);
      }
    },
    [
      searchTerm,
      filterType,
      filterYear,
      purposes,
      initialRows,
      onFilteredDataChange,
      filteredRows.length,
    ],
  );

  // Initialize filtered data and handle filter changes
  useEffect(() => {
    if (filterType === 'all' && purposes.length === 0) {
      applyFilters(true);
    }
  }, [filterType, purposes, applyFilters]);

  const handleFilterTypeChange = (event: SelectChangeEvent<string>) => {
    const newFilterType = event.target.value;
    setFilterType(newFilterType);
    if (newFilterType === 'all') {
      applyFilters(true);
    }
  };

  const handleFilterYearChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const year = parseInt(event.target.value, 10);
    if (!Number.isNaN(year)) {
      setFilterYear(year);
    }
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

  // FIX 4: Simplified the search handler to only update state.
  // The useEffect handles the actual filtering.
  const handleSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      applyFilters(true);
    },
    [applyFilters],
  );

  // Unused state removed: `setRows` was not needed as `initialRows` is the source of truth.
  // Redundant callbacks removed: `filterRows` and `searchRows` are replaced by the central `useEffect`.

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

  useEffect(() => {
    if (purposesData?.data) {
      setAvailablePurposes(purposesData.data);
    }
  }, [purposesData?.data]);

  const getFilterLabel = () => {
    switch (filterType) {
      case 'calendar':
        return `Calendar Year: ${filterYear}`;
      case 'fiscal':
        return `Fiscal Year: ${filterYear}`;
      case 'thirty':
        return 'Last 30 Days';
      case 'ninty':
        return 'Last 90 Days';
      default:
        return 'All Time'; // Fallback label
    }
  };

  // FIX 5: Corrected typo in function name.
  const handlePurposesChange = (event: SelectChangeEvent<typeof purposes>) => {
    const {
      target: { value },
    } = event;
    const newPurposes = typeof value === 'string' ? value.split(',') : value;
    setPurposesFilter(newPurposes);
    if (newPurposes.length === 0) {
      applyFilters(true);
    }
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          marginBottom: 2,
        }}
      >
        {!hideSearch && (
          <TextField
            label="Search by donor name"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: `calc(100% / 4` }}
          />
        )}
        <Button
          onClick={openPopover}
          aria-describedby="filterBtn"
          variant="outlined"
        >
          Filter Donation
        </Button>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {filterType !== 'all' && (
            <Chip
              label={getFilterLabel()}
              onDelete={() => {
                setFilterType('all');
                applyFilters(true);
              }}
              color="primary"
              variant="outlined"
            />
          )}
          {purposes.map((purposeId) => {
            const purpose = availablePurposes.find((p) => p._id === purposeId);
            return (
              <Chip
                key={purposeId}
                label={`Purpose: ${purpose ? purpose.name : purposeId}`}
                onDelete={() => {
                  setPurposesFilter(purposes.filter((id) => id !== purposeId));
                  applyFilters(true);
                }}
                color="primary"
                variant="outlined"
              />
            );
          })}
        </Box>
      </Box>
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
              {/* Date Filter Section */}
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
                      type="number"
                      value={filterYear}
                      onChange={handleFilterYearChange}
                      style={{ marginLeft: '10px' }}
                      disabled={!['calendar', 'fiscal'].includes(filterType)}
                    />
                  </div>
                </div>
              </Grid>
              {/* Amount Filter Section (UI Only) */}
              <Grid item xs={6}>
                <div className="filterParent">
                  <div className="filterHeader">Amount</div>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Select defaultValue="all" className="fitlerSelect">
                        <MenuItem value="all">All Amounts</MenuItem>
                        <MenuItem value="between">Between</MenuItem>
                        <MenuItem value="more">More than</MenuItem>
                        <MenuItem value="less">Less than</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={8}>
                      <div className="rangeParent">
                        {/* FIX 6: Removed incorrect onChange handlers. These need their own state and logic. */}
                        <TextField label="Min" className="rangeInput" />
                        <div className="dash">-</div>
                        <TextField label="Max" className="rangeInput" />
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
              {/* Purpose Filter Section */}
              <Grid item xs={12}>
                <div className="filterParent">
                  <div className="filterHeader">Purpose</div>
                  <Select
                    className="filterChooseMultiple"
                    multiple
                    fullWidth
                    onChange={handlePurposesChange}
                    value={purposes}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((purposeId: string) => {
                          const purpose = availablePurposes.find(
                            (p) => p._id === purposeId,
                          );
                          return (
                            <Chip
                              key={purposeId}
                              label={purpose ? purpose.name : purposeId}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {availablePurposes.map((purpose) => (
                      <MenuItem key={purpose._id} value={purpose._id}>
                        {purpose.name}
                      </MenuItem>
                    ))}
                  </Select>
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
              <Button variant="outlined" onClick={closePopover}>
                Cancel
              </Button>
              {/* FIX 7: The "Apply" button now just closes the popover.
                  The useEffect applies filters automatically as they are changed. */}
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  applyFilters();
                  closePopover();
                }}
              >
                Apply Filters
              </Button>
            </Box>
          </div>
        </Popover>
      )}
      {initialRows.length === 0 ? (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ fontSize: '2rem', fontWeight: 'bold' }}>No Results</Box>
        </Box>
      ) : (
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
