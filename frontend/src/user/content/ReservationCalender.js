import React, { useEffect, useState } from 'react';
import 'user/content/ReservationCalender.css';

const ReservationCalender = ({ onRentalPeriod }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonteDate, setCurrentMonteDate] = useState(new Date());
  const [nextMonteDate, setNextMonteDate] = useState(new Date());
  const [firstSelectedDay, setFirstSelectedDay] = useState(null);  // 첫 번째 달력 선택된 날짜
  const [secondSelectedDay, setSecondSelectedDay] = useState(null); // 두 번째 달력 선택된 날짜
  const [firstSelectedRange, setFirstSelectedRange] = useState([]); // 첫 번째 달력 날짜 범위
  const [secondSelectedRange, setSecondSelectedRange] = useState([]); // 두 번째 달력 날짜 범위
  const [firstSaveRange, setFirstSaveRange] = useState([]); // 첫 번째 달력 날짜 범위 저장
  const [secondSaveRange, setSecondSaveRange] = useState([]); // 두 번째 달력 날짜 범위 저장

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
      if (firstSelectedDay === null) {
        setFirstSelectedDay(new Date(year, month, day));
        console.log(firstSelectedDay);
      } else {
        setSecondSelectedDay(new Date(year, month, day));
      }
    } else {
      if (firstSelectedDay === null) {
        setFirstSelectedDay(new Date(nextMonthYear, nextMonth, day));
        console.log(firstSelectedDay);
      } else {
        setSecondSelectedDay(new Date(nextMonthYear, nextMonth, day));
      }
    }
  };

  const getFirstCalendarRange = (startDay, endDay) => {
    const range = [];
    if (startDay.getFullYear() === year && startDay.getMonth() === month) {
      if (endDay.getFullYear() === year && endDay.getMonth() === month) {
        for (let i = startDay.getDate(); i <= endDay.getDate(); i++) {
          range.push(i);
        }
      } else {
        for (let i = startDay.getDate(); i <= lastDayOfMonth.getDate(); i++) {
          range.push(i);
        }
      }
    }
    return range; // 항상 반환
  };
  const getSecondCalendarRange = (startDay, endDay) => {
    const range = [];
    if (startDay.getFullYear() === year && startDay.getMonth() === month) {
      if (endDay.getFullYear() === year && endDay.getMonth() === month) {
        return range;
      } else {
        const startDate = firstDayOfNextMonth.getDate();
        const endDate = endDay.getDate();
        for (let i = startDate; i <= endDate; i++) {
          range.push(i);
        }
        return range;
      }
    } else {
      if (endDay.getFullYear() === nextMonthYear && endDay.getMonth() === nextMonth) {
        const startDate = startDay.getDate();
        const endDate = endDay.getDate();
        for (let i = startDate; i <= endDate; i++) {
          range.push(i);
        }
        return range;
      }
    }
  };

  useEffect(() => {
    setNextMonteDate(new Date(year, month + 1, 1));
  }, []);
  useEffect(() => {
    console.log(nextMonthDays);
  }, [nextMonthDays]);

  useEffect(() => {
    if (firstSelectedDay && secondSelectedDay) {
      onRentalPeriod(firstSelectedDay, secondSelectedDay);
      setFirstSelectedRange(getFirstCalendarRange(firstSelectedDay, secondSelectedDay));
      setSecondSelectedRange(getSecondCalendarRange(firstSelectedDay, secondSelectedDay));
      setFirstSaveRange(getFirstCalendarRange(firstSelectedDay, secondSelectedDay));
      setSecondSaveRange(getSecondCalendarRange(firstSelectedDay, secondSelectedDay));
    } else {
      // 선택 범위 초기화
      setFirstSelectedRange([]);
      setSecondSelectedRange([]);
    }
  }, [firstSelectedDay, secondSelectedDay]);
  useEffect(() => {
    console.log(firstSelectedRange);
    console.log(secondSelectedRange);
    console.log(firstDayOfNextMonth.getDate());
  }, [firstSelectedRange, secondSelectedRange]);



  const isDayInFirstRange = (day) => firstSelectedRange.includes(day) || false;
  const isDayInSecondRange = (day) => secondSelectedRange.includes(day) || false;

  return (
    <div className='reservation-calendar-wrap'>
      <div className="reservation-calendar">
        <div className="reservation-calendar-header">
          <div className='reservation-calender-button-wrap'>
            <button onClick={goToPreviousMonth}>◀</button>
          </div>
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
          <div className='reservation-calender-button-wrap'>
            <button onClick={goToNextMonth}>▶</button>
          </div>
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
    </div>
  );
};

export default ReservationCalender;
