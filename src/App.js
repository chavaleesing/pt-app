import React, { useState } from 'react';
import './App.css';

function MonthInputs({ month, onChange }) {
  const months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' },
  ];

  return (
    <select value={month} onChange={onChange} className="month-select">
      {months.map((m) => (
        <option key={m.value} value={m.value}>{m.name}</option>
      ))}
    </select>
  );
}

function App() {
  const [selectedMonth, setSelectedMonth] = useState(1); // Default to January (value: 1)
  const [inputValues, setInputValues] = useState(Array(31).fill('')); // Default to 31 empty strings
  const [totalAmount, setTotalAmount] = useState('');

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10)); // Parse selected month to integer
    setInputValues(Array(getDaysInMonth(parseInt(e.target.value, 10))).fill('')); // Reset input values based on selected month
  };

  const getDaysInMonth = (month) => {
    switch (month) {
      case 2:
        return 29; // Set max date for February
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
  const numDays = getDaysInMonth(selectedMonth);
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
      <h1>Dynamic Input Boxes Based on Month</h1>
      <MonthInputs month={selectedMonth} onChange={handleMonthChange} />
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
