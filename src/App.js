import React, { useState } from 'react';
import './App.css';
import MonthInputs from './MonthInputs';

function App() {
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(1); // Default to January (value: 1)
  const [selectedYear, setSelectedYear] = useState(currentYear); // Default to current year
  const [inputValues, setInputValues] = useState(Array(31).fill('')); // Default to 31 empty strings
  const [totalAmount, setTotalAmount] = useState('');

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
    // Validate input to be a number (you can modify this validation as needed)
    if (/^\d*\.?\d*$/.test(value)) {
      setTotalAmount(value);
    }
  };

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    // Validate input to be an integer
    if (/^\d*$/.test(value)) {
      const newInputValues = [...inputValues];
      newInputValues[index] = value;
      setInputValues(newInputValues);
    }
  };

  // Generate input boxes based on numDays
  const numDays = getDaysInMonth(selectedMonth, selectedYear);
  const inputs = [];
  for (let i = 0; i < numDays; i++) {
    inputs.push(
      <input
        key={i}
        type="text"
        placeholder={`Day ${i + 1}`}
        value={inputValues[i]}
        onChange={(e) => handleInputChange(e, i)}
        className="left-aligned-input"
      />
    );
  }

  return (
    <div className="App">
      <h1>Dynamic Input Boxes Based on Month and Year</h1>
      <MonthInputs
        month={selectedMonth}
        year={selectedYear}
        onChangeMonth={handleMonthChange}
        onChangeYear={handleYearChange}
      />
      <div className="total-amount">
        <label>Total Amount:</label>
        <input
          type="text"
          value={totalAmount}
          onChange={handleTotalAmountChange}
          placeholder="Enter total amount"
        />
      </div>
      <div className="inputs-container">
        {inputs}
      </div>
    </div>
  );
}

export default App;
