import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import IDonor from '../util/types/donor';
import { postData } from '../util/api';

interface ProfileInfoProps {
  donatorData: IDonor | null;
}

function DonorNoteBox({ donatorData }: ProfileInfoProps) {
  const [open, setOpen] = useState(false); // State to manage dialog visibility
  const [noteText, setNoteText] = useState<string>(''); // State to capture note text

  const handleOpen = () => {
    if (donatorData != null) {
      setNoteText(donatorData.note);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveNote = () => {
    if (donatorData != null) {
      // eslint-disable-next-line no-underscore-dangle
      const data = { id: donatorData._id, note: noteText };
      postData('donor/note', data)
        .then((response2) => {
          console.log(response2);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    handleClose(); // Close dialog after saving note
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        maxHeight: 300,
        overflow: 'auto',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Note
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        sx={{ maxHeight: 120, overflowY: 'auto', marginBottom: '10px' }}
      >
        {donatorData?.note}
      </Typography>
      <Button variant="outlined" onClick={handleOpen}>
        Take Note
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Take Note</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Type your note here..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveNote} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DonorNoteBox;
