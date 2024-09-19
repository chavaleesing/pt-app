import React, { useState } from 'react';
import MonthInputs from './MonthInputs';
import axios from 'axios';
import { TextField, Button, Typography, Container } from '@mui/material';

function Tbt() {
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [taxSale, setTaxSale] = useState('');
  const [untaxSale, setUntaxSale] = useState('');

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleTaxSaleChange = (e) => { setTaxSale(e.target.value);};
  const handleUntaxSaleChange = (e) => {setUntaxSale(e.target.value);};

  const handleSubmit = async () => {
    // Construct the first_date in 'YYYY-MM-DD' format
    try {
    const firstDate = `${selectedYear}-${selectedMonth.padStart(2, '0')}-01`;
    var requestData = {
        tax_sale: taxSale,
        untax_sale: untaxSale,
        date: firstDate,
    };

    // Send data to the API
    const response = await axios.post('https://pt-api-jrep.onrender.com/purchase-report', requestData, {
        responseType: 'blob',
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" style={{ margin: '50px' }} align="center" gutterBottom>
        Form Submission
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
      <Button onClick={handleSubmit} variant="contained" color="primary" size="large" fullWidth>
        Submit
      </Button>
    </Container>
  );
}

export default Tbt;
