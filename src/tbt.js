import React, { useState } from 'react';
import MonthInputs from './MonthInputs';
import axios from 'axios';
import { TextField, Button, Typography, Container, CircularProgress } from '@mui/material';

function Tbt() {
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [taxSale, setTaxSale] = useState('');
  const [untaxSale, setUntaxSale] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleTaxSaleChange = (e) => { setTaxSale(e.target.value);};
  const handleUntaxSaleChange = (e) => {setUntaxSale(e.target.value);};

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true when the API call starts
    try {
      const firstDate = `${selectedYear}-${selectedMonth.padStart(2, '0')}-01`;
      const requestData = {
        tax_sale: taxSale,
        untax_sale: untaxSale,
        date: firstDate,
      };

      // Send data to the API
      const response = await axios.post('https://pt-api-jrep.onrender.com/purchase-report', requestData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Set loading to false when the API call ends
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" style={{ margin: '10px' }} align="center" gutterBottom>
        เทพบัวทอง
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <MonthInputs month={selectedMonth} year={selectedYear} onChangeMonth={handleMonthChange} onChangeYear={handleYearChange} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <TextField
          type="number"
          label="ยอดขายที่ต้องเสียภาษี"
          value={taxSale}
          onChange={handleTaxSaleChange}
          placeholder="ยอดขายที่ต้องเสียภาษี"
          variant="outlined"
          style={{ marginRight: '20px' }}
        />
        <TextField
          type="number"
          label="ยอดขายที่ได้รับยกเว้น"
          value={untaxSale}
          onChange={handleUntaxSaleChange}
          placeholder="ยอดขายที่ได้รับยกเว้น"
          variant="outlined"
        />
      </div>
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        disabled={loading} // Disable the button while loading
        startIcon={loading ? <CircularProgress size={20} /> : null} // Show spinner when loading
      >
        {loading ? 'กำลังประมวลผล...' : 'สร้างรีพอต'}
      </Button>
    </Container>
  );
}

export default Tbt;
