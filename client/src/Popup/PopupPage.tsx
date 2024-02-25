import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

function PopupPage() {
  const [openPopup, setOpenPopup] = useState(false);

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  return (
    <div>
      <Button onClick={handleOpenPopup}>Popup 1</Button>

      {/* Popup */}
      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>John Smith Summary</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Total Donation Amount</TableCell>
                  <TableCell>$5000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Donation (Fiscal)</TableCell>
                  <TableCell>$1000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Donation (Calendar)</TableCell>
                  <TableCell>$1200</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Donation (Past 30 Days)</TableCell>
                  <TableCell>$800</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Recent Donation</TableCell>
                  <TableCell>$2000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Recent Campaign</TableCell>
                  <TableCell>Campaign XYZ</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PopupPage;
