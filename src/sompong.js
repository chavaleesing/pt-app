import React, { useState } from 'react';
import './App.css';
import MonthInputs from './MonthInputs';
import ErrorModal from './ErrorModal';
import { TextField, Button, Typography, Container, CircularProgress } from '@mui/material';
import axios from 'axios';

function Sompong() {
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [inputValues, setInputValues] = useState(Array(31).fill(''));
  const [totalAmount, setTotalAmount] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formattedDate, setFormattedDate] = useState('2024-01-01');
  const [loading, setLoading] = useState(false); // Loading state

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

  const handleTotalAmountChange = (e) => { setTotalAmount(e.target.value); };

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) || value === '') {
      const newInputValues = [...inputValues];
      newInputValues[index] = value;
      setInputValues(newInputValues);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!selectedMonth || !selectedYear || inputValues.some(value => value === '') || totalAmount === '') {
        setErrorMessage('Please input all data.');
        setShowErrorModal(true);
        return;
      }

      const requestData = {
        date: formattedDate,
        slip_count: inputValues.map(value => parseInt(value, 10)),
        total_amount: parseInt(totalAmount),
      };

      const response = await axios.post('https://pt-api-jrep.onrender.com/sale-report', requestData, {
        responseType: 'blob',
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
      });

      setInputValues(Array(getDaysInMonth(selectedMonth, selectedYear)).fill(''));
      setTotalAmount('');
      setShowErrorModal(false);

    } catch (error) {
      let errorMessage = 'Server Error. Please try again later.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      setErrorMessage(errorMessage);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const numDays = getDaysInMonth(selectedMonth, selectedYear);
  const inputs = [];
  for (let i = 0; i < numDays; i++) {
    inputs.push(
      <TextField
        key={i}
        type="text"
        label={`วันที่ ${i + 1}`}
        value={inputValues[i]}
        onChange={(e) => handleInputChange(e, i)}
        variant="outlined"
        style={{ margin: '5px' }} 
        sx={{width: 100}}
      />
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" style={{ margin: '10px' }} align="center" gutterBottom>
        สมพงศ์
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MonthInputs month={selectedMonth} year={selectedYear} onChangeMonth={handleMonthChange} onChangeYear={handleYearChange} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <TextField
          type="number"
          label="ยอดรวม"
          value={totalAmount}
          onChange={handleTotalAmountChange}
          placeholder="ยอดรวม"
          variant="outlined"
        />
      </div>
      <div>{inputs}</div>
      <ErrorModal show={showErrorModal} handleClose={() => setShowErrorModal(false)} errorMessage={errorMessage} />

      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        size="large"
        style={{ margin: '20px' }} 
        fullWidth
        disabled={loading} // Disable the button while loading
        startIcon={loading ? <CircularProgress size={20} /> : null} // Show spinner when loading
      >
        {loading ? 'กำลังประมวลผล...' : 'สร้างรีพอต'}
      </Button>

    </Container>
  );
}

export default Sompong;
