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
  const [formattedDate, setFormattedDate] = useState('2024-01-01');

  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value, 10);
    setSelectedMonth(month);
    setInputValues(Array(getDaysInMonth(month, selectedYear)).fill(''));
    updateFormattedDate(month, selectedYear);
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value, 10);
    setSelectedYear(year);
    setInputValues(Array(getDaysInMonth(selectedMonth, year)).fill(''));
    updateFormattedDate(selectedMonth, year);
  };

  const updateFormattedDate = (month, year) => {
    const formatted = `${year}-${String(month).padStart(2, '0')}-01`;
    setFormattedDate(formatted);
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
    try {
      // Validate inputs
      if (!selectedMonth || !selectedYear || inputValues.some(value => value === '') || totalAmount === '') {
        setErrorMessage('Please input all data.');
        setShowErrorModal(true);
        return;
      }
  
      // Prepare data for API request
      const requestData = {
        date: formattedDate,
        month: selectedMonth,
        year: selectedYear,
        slip_count: inputValues.map(value => parseInt(value, 10)), // Ensure slip_count is an array of integers
        total_amount: parseInt(totalAmount) || 0,
      };
  
      // Send POST request to API
      const response = await axios.post('https://pt-api-jrep.onrender.com/sale-report', requestData, {
        responseType: 'blob', // Ensure response type is arraybuffer to handle binary data
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
    });;


  
      // console.log('Data sent successfully:', response.data);
  
      // Download file after successful API call
      // downloadExcelFile(response.data);
  
      // Reset form or perform other actions as needed
      setInputValues(Array(getDaysInMonth(selectedMonth, selectedYear)).fill(''));
      setTotalAmount('');
      setShowErrorModal(false); // Close error modal
  
    } catch (error) {
      console.error('Error sending data:', error);
  
      let errorMessage = 'Server Error. Please try again later.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message; // Use specific error message from API if available
      }
  
      setErrorMessage(errorMessage); // Set error message
      setShowErrorModal(true); // Show error modal
    }
  };
  

  const downloadExcelFile = (data) => {
    // Create a Blob from the API response data
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
  
    // Create a temporary anchor element for download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sale_report.xlsx'; // Set your desired file name here
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    // Clean up: revoke the URL to release the Blob
    URL.revokeObjectURL(url);
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
