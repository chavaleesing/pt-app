import React from 'react';

function MonthInputs({ month, year, onChangeMonth, onChangeYear }) {
  const months = [
    { value: 1, name: 'มกราคม' },
    { value: 2, name: 'กุมภาพันธ์' },
    { value: 3, name: 'มีนาคม' },
    { value: 4, name: 'เมษายน' },
    { value: 5, name: 'พฤษภาคม' },
    { value: 6, name: 'มิถุนายน' },
    { value: 7, name: 'กรกฎาคม' },
    { value: 8, name: 'สิงหาคม' },
    { value: 9, name: 'กันยายน' },
    { value: 10, name: 'ตุลาคม' },
    { value: 11, name: 'พฤศจิกายน' },
    { value: 12, name: 'ธันวาคม' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, index) => currentYear - index); // Generate years for a decade

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
