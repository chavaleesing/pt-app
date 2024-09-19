import React, { useState } from 'react';
import './App.css';
import MonthInputs from './MonthInputs';
import ErrorModal from './ErrorModal';
import { TextField, Button, Typography, Container, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Green checkmark icon
import axios from 'axios';

function Tbt() {
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [inputValues, setInputValues] = useState(Array(31).fill(''));
  const [taxSale, setTaxSale] = useState('');
  const [untaxSale, setUntaxSale] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formattedDate, setFormattedDate] = useState('2024-01-01');
  const [loading, setLoading] = useState(false); // New state for loading
  const [success, setSuccess] = useState(false); // New state for success

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

  const handleTaxSale = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) || value === '') {
      setTaxSale(value);
    }
  };

  const handleUntaxSale = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) || value === '') {
      setUntaxSale(value);
    }
  };

  const handleSubmit = async () => {
    setLoading(true); // Start loading
    setSuccess(false); // Reset success state
    try {
      if (!selectedMonth || !selectedYear || taxSale === '' || untaxSale === '') {
        setErrorMessage('Please input all data.');
        setShowErrorModal(true);
        setLoading(false); // Stop loading
        return;
      }

      const requestData = {
        date: formattedDate,
        tax_sale: parseInt(taxSale) || 0,
        untax_sale: parseInt(untaxSale) || 0,
      };

      await axios.post('https://pt-api-jrep.onrender.com/purchase-report', requestData, {
        responseType: 'blob',
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
      });

      // Reset form after submission
      setInputValues(Array(getDaysInMonth(selectedMonth, selectedYear)).fill(''));
      setTaxSale('');
      setUntaxSale('');
      setShowErrorModal(false);
      setSuccess(true); // Set success state

    } catch (error) {
      let errorMessage = 'Server Error. Please try again later.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      setErrorMessage(errorMessage);
      setShowErrorModal(true);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" style={{ margin: '50px' }} align="center" gutterBottom>
        เทพบัวทอง
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MonthInputs month={selectedMonth} year={selectedYear} onChangeMonth={handleMonthChange} onChangeYear={handleYearChange} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <TextField
          type="text"
          label="ยอดขายที่ต้องเสียภาษี"
          value={taxSale}
          onChange={handleTaxSale}
          placeholder="ยอดขายที่ต้องเสียภาษี"
          variant="outlined"
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <TextField
          type="text"
          label="ยอดขายที่ได้รับยกเว้น"
          value={untaxSale}
          onChange={handleUntaxSale}
          placeholder="ยอดขายที่ได้รับยกเว้น"
          variant="outlined"
        />
      </div>
      <ErrorModal show={showErrorModal} handleClose={() => setShowErrorModal(false)} errorMessage={errorMessage} />
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        disabled={loading} // Disable button while loading
        startIcon={loading ? <CircularProgress size={24} /> : success ? <CheckCircleIcon color="success" /> : null}
      >
        {loading ? 'Submitting...' : success ? 'Submitted' : 'Submit'}
      </Button>
    </Container>
  );
}

export default Tbt;
