import React, { useEffect, useState } from 'react';
import 'user/content/ReservationCalender.css';

const ReservationCalender = ({ onRentalPeriod }) => {
  const currentDate = new Date();
  const [currentMonteDate, setCurrentMonteDate] = useState(new Date());
  const [nextMonteDate, setNextMonteDate] = useState(new Date());
  const [firstSelectedDay, setFirstSelectedDay] = useState(null);  // 첫 번째 달력 선택된 날짜
  const [secondSelectedDay, setSecondSelectedDay] = useState(null); // 두 번째 달력 선택된 날짜
  const [firstSelectedRange, setFirstSelectedRange] = useState([]); // 첫 번째 달력 날짜 범위
  const [secondSelectedRange, setSecondSelectedRange] = useState([]); // 두 번째 달력 날짜 범위


  const year = currentMonteDate.getFullYear();
  const month = currentMonteDate.getMonth();
  const nextMonthYear = nextMonteDate.getFullYear();
  const nextMonth = nextMonteDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfNextMonth = new Date(year, month + 1, 1);
  const lastDayOfNextMonth = new Date(year, month + 2, 0);

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  const days = [];
  for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
    days.push('');
  }
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    days.push(i);
  }

  const nextMonthDays = [];
  for (let i = 0; i < firstDayOfNextMonth.getDay(); i++) {
    nextMonthDays.push('');
  }
  for (let i = 1; i <= lastDayOfNextMonth.getDate(); i++) {
    nextMonthDays.push(i);
  }

  const goToPreviousMonth = () => {
    if (currentMonteDate > currentDate) {
      setCurrentMonteDate(new Date(year, month - 1, 1));
      setNextMonteDate(new Date(year, month, 1));

    }
  };

  const goToNextMonth = () => {
    setCurrentMonteDate(new Date(year, month + 1, 1));
    setNextMonteDate(new Date(year, month + 2, 1));

  };

  const handleSelected = (day, isNextMonth) => {

    if (!isNextMonth) {
      if (currentDate.getTime() > new Date(year, month, day + 1).getTime()) {
        alert("이전날짜는 선택 하실 수 없습니다.");
      } else {

        if (firstSelectedDay == null) {
          setFirstSelectedDay(new Date(year, month, day));
        } else {
          setSecondSelectedDay(new Date(year, month, day));
        }
      }
    } else {
      if (firstSelectedDay == null) {
        setFirstSelectedDay(new Date(nextMonthYear, nextMonth, day));
      } else {
        setSecondSelectedDay(new Date(nextMonthYear, nextMonth, day));
      }

    }
  };

  const filterRangeByCurrentMonth = (startDay, endDay, calendarStart, calendarEnd) => {
    const range = [];
    const rangeStart = Math.max(startDay.getTime(), calendarStart.getTime());
    const rangeEnd = Math.min(endDay.getTime(), calendarEnd.getTime());

    if (rangeStart <= rangeEnd) {
      const startDate = new Date(rangeStart).getDate();
      const endDate = new Date(rangeEnd).getDate();
      for (let i = startDate; i <= endDate; i++) {
        range.push(i);
      }
    }
    return range;
  };
  useEffect(() => {
    if (firstSelectedDay && secondSelectedDay) {
      if (firstSelectedDay > secondSelectedDay) {
        let change = firstSelectedDay;
        setFirstSelectedDay(secondSelectedDay);
        setSecondSelectedDay(change);
      }
      onRentalPeriod(firstSelectedDay, secondSelectedDay);
      const newFirstRange = filterRangeByCurrentMonth(
        firstSelectedDay,
        secondSelectedDay,
        firstDayOfMonth,
        lastDayOfMonth
      );
      const newSecondRange = filterRangeByCurrentMonth(
        firstSelectedDay,
        secondSelectedDay,
        firstDayOfNextMonth,
        lastDayOfNextMonth
      );

      setFirstSelectedRange(newFirstRange);
      setSecondSelectedRange(newSecondRange);
    } else {
      // 선택 범위 초기화
      setFirstSelectedRange([]);
      setSecondSelectedRange([]);
    }
  }, [firstSelectedDay, secondSelectedDay, currentMonteDate]);

  useEffect(() => {
    setNextMonteDate(new Date(year, month + 1, 1));
  }, []);

  const isDayInFirstRange = (day) => firstSelectedRange.includes(day) || false;
  const isDayInSecondRange = (day) => secondSelectedRange.includes(day) || false;

  return (
    <div className='reservation-calendar-wrap'>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chevron-double-left" viewBox="0 0 16 16" onClick={goToPreviousMonth}>
        <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
        <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
      </svg>
      <div className="reservation-calendar">
        <div className="reservation-calendar-header">
          <span>{year}년 {month + 1}월</span>
        </div>
        <div className="reservation-calendar-grid">
          {daysOfWeek.map((day) => (
            <div key={day} className="reservation-calendar-day-of-week">{day}</div>
          ))}
          {days.map((day, index) => (
            <div
              key={index}
              className={`reservation-calendar-day
                ${isDayInFirstRange(day) ? 'selected-range' : ''}
                ${index % 7 === 0 ? 'day-off' : ''}
                ${firstSelectedDay && firstSelectedDay.getMonth() === month && firstSelectedDay.getDate() === day ? 'selected' : ''}
                ${secondSelectedDay && secondSelectedDay.getMonth() === month && secondSelectedDay.getDate() === day ? 'selected' : ''}
                ${day ? '' : 'empty'}
                ${currentDate.getMonth() + 1 === currentMonteDate.getMonth() + 1 && currentDate.getDate() > day ? 'disabled-day' : ''}
              `}
              onClick={() => handleSelected(day, false)} // 첫 번째 달력에서 클릭
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className="reservation-calendar">
        <div className="reservation-calendar-header">
          <span>{nextMonthYear}년 {nextMonth + 1}월</span>
        </div>
        <div className="reservation-calendar-grid">
          {daysOfWeek.map((day) => (
            <div key={day} className="reservation-calendar-day-of-week">{day}</div>
          ))}
          {nextMonthDays.map((day, index) => (
            <div
              key={index}
              className={`reservation-calendar-day 
                ${isDayInSecondRange(day) ? 'selected-range' : ''}
                ${index % 7 === 0 ? 'day-off' : ''}
                ${firstSelectedDay && firstSelectedDay.getMonth() === nextMonth && firstSelectedDay.getDate() === day ? 'selected' : ''}
                ${secondSelectedDay && secondSelectedDay.getMonth() === nextMonth && secondSelectedDay.getDate() === day ? 'selected' : ''}
                ${day ? '' : 'empty'}
              `}
              onClick={() => handleSelected(day, true)} // 두 번째 달력에서 클릭
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chevron-double-right" viewBox="0 0 16 16" onClick={goToNextMonth}>
        <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708" />
        <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708" />
      </svg>
    </div>
  );
};

export default ReservationCalender;
