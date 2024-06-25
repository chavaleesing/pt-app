// App.js

import React, { useState } from 'react';
import './App.css';
import MonthInputs from './MonthInputs'; // Assuming MonthInputs is another component you have
import ErrorModal from './ErrorModal'; // Import ErrorModal component
import { TextField, Button, Typography, Container } from '@mui/material';

function App() {
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(1); // Default to January (value: 1)
  const [selectedYear, setSelectedYear] = useState(currentYear); // Default to current year
  const [inputValues, setInputValues] = useState(Array(31).fill('')); // Default to 31 empty strings
  const [totalAmount, setTotalAmount] = useState(''); // Total amount as string
  const [showErrorModal, setShowErrorModal] = useState(false); // State for showing error modal
  const [errorMessage, setErrorMessage] = useState(''); // Error message state

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10)); // Parse selected month to integer
    setInputValues(Array(getDaysInMonth(parseInt(e.target.value, 10), selectedYear)).fill('')); // Reset input values based on selected month and year
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10)); // Parse selected year to integer
    setInputValues(Array(getDaysInMonth(selectedMonth, parseInt(e.target.value, 10))).fill('')); // Reset input values based on selected month and year
  };

  const getDaysInMonth = (month, year) => {
    switch (month) {
      case 2:
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28; // Leap year calculation for February
      case 4:
      case 6:
      case 9:
      case 11:
        return 30; // April, June, September, November have 30 days
      default:
        return 31; // January, March, May, July, August, October, December have 31 days
    }
  };

  const handleTotalAmountChange = (e) => {
    const { value } = e.target;
    // Validate input to be an integer
    if (/^\d*$/.test(value) || value === '') { // Allow empty string or digits only
      setTotalAmount(value);
    }
  };

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    // Validate input to be an integer
    if (/^\d*$/.test(value) || value === '') { // Allow empty string or digits only
      const newInputValues = [...inputValues];
      newInputValues[index] = value;
      setInputValues(newInputValues);
    }
  };

  const handleSubmit = () => {
    // Check if any required field is empty
    if (!selectedMonth || !selectedYear || inputValues.some(value => value === '') || totalAmount === '') {
      setErrorMessage('Please input all data.'); // Set error message
      setShowErrorModal(true); // Show error modal
      return;
    }

    // Construct the date in "2006-02-01" format
    const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;

    // Here you can handle submitting the data, e.g., sending it to an API or processing it
    console.log({
      date: formattedDate,
      month: selectedMonth,
      year: selectedYear,
      inputValues: inputValues.map(value => parseInt(value, 10)), // Convert input values to integers
      totalAmount: parseInt(totalAmount) || 0, // Convert totalAmount to integer or default to 0
    });

    // Reset form or perform other actions as needed
    setInputValues(Array(getDaysInMonth(selectedMonth, selectedYear)).fill(''));
    setTotalAmount('');
    setShowErrorModal(false); // Close error modal
  };

  // Generate input boxes based on numDays
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
        /></div><div style={{ display: 'flex', justifyContent: 'center' }}>
        <TextField
          type="text"
          label="Total Amount"
          value={totalAmount}
          onChange={handleTotalAmountChange}
          placeholder="Enter total amount"
          style={{ maxWidth: '1500px', align: "center" }}
          className="total-amount-input"
        /></div>
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
