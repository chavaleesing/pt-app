// ErrorModal.js

import React from 'react';
import { Modal, Button, Typography, Box } from '@mui/material';

const ErrorModal = ({ show, handleClose, errorMessage }) => {
  return (
    <Modal
      open={show}
      onClose={handleClose}
      aria-labelledby="error-modal-title"
      aria-describedby="error-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="error-modal-title" variant="h6" component="h2" align="center" gutterBottom>
          Error
        </Typography>
        <Typography id="error-modal-description" variant="body1" align="center">
          {errorMessage}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ErrorModal;
