import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';

interface DateTimePickerProps {
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export function DateTimePicker({ selectedDate, selectedTime, onDateChange, onTimeChange }: DateTimePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  
  const dayNames = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert to Monday = 0

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handleDateSelect = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, day);
    const formattedDate = date.toISOString().split('T')[0];
    onDateChange(formattedDate);
    setShowCalendar(false);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'Seleziona data';
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  const currentHour = selectedTime ? selectedTime.split(':')[0] : '';
  const currentMinute = selectedTime ? selectedTime.split(':')[1] : '';

  return (
    <div className="grid grid-cols-2 gap-2">
      {/* Date Picker */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D7ED4] flex items-center justify-between hover:border-gray-400 transition-colors bg-white text-sm"
        >
          <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
            {formatDisplayDate(selectedDate)}
          </span>
          <Calendar className="w-4 h-4 text-gray-400" />
        </button>

        {showCalendar && (
          <div className="absolute top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 w-72 left-0">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={previousMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-gray-900 text-sm font-medium">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day, index) => (
                <div key={index} className="text-center text-gray-500 text-xs py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => day && handleDateSelect(day)}
                  disabled={!day}
                  className={`
                    aspect-square rounded-lg text-xs transition-colors
                    ${!day ? 'invisible' : ''}
                    ${day && selectedDate && new Date(selectedDate).getDate() === day && 
                      new Date(selectedDate).getMonth() === currentMonth.getMonth()
                      ? 'bg-[#8D7ED4] text-white'
                      : 'hover:bg-gray-100 text-gray-900'
                    }
                  `}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Time Picker */}
      <div className="flex gap-2 items-center">
        <select
          value={currentHour}
          onChange={(e) => {
            const hour = e.target.value;
            const minute = currentMinute || '00';
            onTimeChange(`${hour}:${minute}`);
          }}
          className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D7ED4] bg-white text-sm"
        >
          <option value="">HH</option>
          {hours.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        <span className="text-gray-500 text-sm">:</span>
        <select
          value={currentMinute}
          onChange={(e) => {
            const hour = currentHour || '00';
            const minute = e.target.value;
            onTimeChange(`${hour}:${minute}`);
          }}
          className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D7ED4] bg-white text-sm"
        >
          <option value="">MM</option>
          {minutes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
