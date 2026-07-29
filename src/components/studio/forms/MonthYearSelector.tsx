import React from 'react';

interface MonthYearSelectorProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// generate years from current year down to 50 years ago
const YEARS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

export function MonthYearSelector({ value, onChange, disabled }: MonthYearSelectorProps) {
  let currentMonth = "";
  let currentYear = "";

  if (value && value !== "Present") {
    const parts = value.split(" ");
    if (parts.length === 2) {
      currentMonth = parts[0];
      currentYear = parts[1];
    } else if (parts.length === 1) {
      if (MONTHS.includes(parts[0])) currentMonth = parts[0];
      else currentYear = parts[0];
    }
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    if (!newMonth && !currentYear) onChange("");
    else if (!newMonth) onChange(currentYear);
    else if (!currentYear) onChange(newMonth);
    else onChange(`${newMonth} ${currentYear}`);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    if (!newYear && !currentMonth) onChange("");
    else if (!newYear) onChange(currentMonth);
    else if (!currentMonth) onChange(newYear);
    else onChange(`${currentMonth} ${newYear}`);
  };

  if (disabled && value === "Present") {
    return (
      <div className="w-full px-4 py-3 bg-slate-100 border-2 border-transparent rounded-lg text-slate-500 sm:text-sm font-medium h-[46px] flex items-center">
        Present
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <select
        value={currentMonth}
        onChange={handleMonthChange}
        disabled={disabled}
        className="flex-1 px-3 py-3 bg-slate-100 hover:bg-slate-200 focus:bg-white border-2 border-transparent focus:border-pink-500 rounded-lg outline-none transition-colors sm:text-sm text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Month</option>
        {MONTHS.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      
      <select
        value={currentYear}
        onChange={handleYearChange}
        disabled={disabled}
        className="flex-1 px-3 py-3 bg-slate-100 hover:bg-slate-200 focus:bg-white border-2 border-transparent focus:border-pink-500 rounded-lg outline-none transition-colors sm:text-sm text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Year</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}
