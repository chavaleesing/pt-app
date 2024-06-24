import React from 'react';

function MonthInputs({ month, year, onChangeMonth, onChangeYear }) {
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, index) => currentYear - index); // Generate years for a decade

  return (
    <div>
      <select value={month} onChange={onChangeMonth} className="month-select">
        {months.map((m) => (
          <option key={m.value} value={m.value}>{m.name}</option>
        ))}
      </select>
      <select value={year} onChange={onChangeYear} className="year-select">
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}

export default MonthInputs;
