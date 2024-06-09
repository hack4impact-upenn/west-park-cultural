import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

/**
 * A modal component that displays a confirmation message and a button to confirm the action or cancel the action.
 * @param buttonText - the text to display on the confirmation button
 * @param title - the title of the modal
 * @param body - the body of the modal
 * @param onConfirm - the function to call when the confirmation button is clicked
 */
export default function EmailModal() {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    // add in logic to handle confirmation here
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Popup</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Did you send the email with the copied emails addresses? If so,
            click &quot;Sent&quot; below, so that your communication can be
            saved in our records.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Not sent</Button>
          <Button onClick={handleConfirm} autoFocus>
            Sent
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
