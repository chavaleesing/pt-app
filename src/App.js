import React, { useState } from 'react';
import './App.css';
import MonthInputs from './MonthInputs';
import ErrorModal from './ErrorModal';
import { TextField, Button, Typography, Container } from '@mui/material';
import axios from 'axios';

function App() {
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [inputValues, setInputValues] = useState(Array(31).fill(''));
  const [totalAmount, setTotalAmount] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10));
    setInputValues(Array(getDaysInMonth(parseInt(e.target.value, 10), selectedYear)).fill(''));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
    setInputValues(Array(getDaysInMonth(selectedMonth, parseInt(e.target.value, 10))).fill(''));
  };

  const getDaysInMonth = (month, year) => {
    switch (month) {
      case 2:
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
      case 4:
      case 6:
      case 9:
      case 11:
        return 30;
      default:
        return 31;
    }
  };

  const handleTotalAmountChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) || value === '') {
      setTotalAmount(value);
    }
  };

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) || value === '') {
      const newInputValues = [...inputValues];
      newInputValues[index] = value;
      setInputValues(newInputValues);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMonth || !selectedYear || inputValues.some(value => value === '') || totalAmount === '') {
      setErrorMessage('Please input all data.');
      setShowErrorModal(true);
      return;
    }

    const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;

    try {
      const response = await axios.post('http://localhost:8080/sale-report', {
        date: formattedDate,
        month: selectedMonth,
        year: selectedYear,
        slip_count: inputValues.map(value => parseInt(value, 10)),
        total_amount: parseInt(totalAmount) || 0,
      });

      console.log('Data sent successfully:', response.data);

      // Reset form or perform other actions as needed
      setInputValues(Array(getDaysInMonth(selectedMonth, selectedYear)).fill(''));
      setTotalAmount('');
      setShowErrorModal(false); // Close error modal

    } catch (error) {
      console.error('Error sending data:', error);

      setErrorMessage('Server Error. Please try again later.'); // Set error message
      setShowErrorModal(true); // Show error modal
    }
  };

  const numDays = getDaysInMonth(selectedMonth, selectedYear);
  const inputs = [];
  for (let i = 0; i < numDays; i++) {
    inputs.push(
      <TextField
        key={i}
        type="text"
        label={`Day ${i + 1}`}
        value={inputValues[i]}
        onChange={(e) => handleInputChange(e, i)}
        className="left-aligned-input"
        variant="outlined"
      />
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" style={{ margin: '50px' }} align="center" gutterBottom>
        Dynamic Input Boxes Based on Month and Year
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MonthInputs
          month={selectedMonth}
          year={selectedYear}
          onChangeMonth={handleMonthChange}
          onChangeYear={handleYearChange}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <TextField
          type="text"
          label="Total Amount"
          value={totalAmount}
          onChange={handleTotalAmountChange}
          placeholder="Enter total amount"
          className="total-amount-input"
          InputProps={{
            style: {
              fontSize: '20px', // Increase font size here
            },
          }}
        />
      </div>
      <div className="inputs-container" style={{ margin: '15px' }}>
        {inputs}
      </div>
      <ErrorModal
        show={showErrorModal}
        handleClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
      />
      <Button onClick={handleSubmit} variant="contained" color="primary" size="large" fullWidth>
        Submit
      </Button>
    </Container>
  );
}

export default App;
