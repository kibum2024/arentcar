// 차종별 예약 건수
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker'; // 달력 라이브러리
import { ko } from 'date-fns/locale'; // 달력을 한글로 바꾸기
import 'react-datepicker/dist/react-datepicker.css';
import './AllBranchesReservationChart.css';
import 'index.css';
import axios from 'axios';
import { endOfMonth, startOfMonth } from 'date-fns';
import { subDays } from 'date-fns';
import { format } from 'date-fns';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AllCarTypeReservationChart = () => {
    const [startDate, setStartDate] = useState(subDays(new Date(), 7));
    const [endDate, setEndDate] = useState(new Date());
    const [chartData, setChartData] = useState([]); // 차트에 넘겨질 데이터
    const [filter, setFilter] = useState('daily'); // 일별, 월별 필터
    const filterText = filter === 'daily' ? '일별 차종 예약 통계' : '월별 차종 예약 통계';

    // 일별, 월별 클릭 시 호출
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setStartDate(null);
        setEndDate(null);
    };

    const fetchChartData = () => {
        if (startDate && endDate) {
            let formattedStartDate, formattedEndDate;

            if (filter === 'daily') {
                formattedStartDate = startDate.toISOString().slice(0, 10).replace(/-/g, '');
                formattedEndDate = endDate.toISOString().slice(0, 10).replace(/-/g, '');
            } else if (filter === 'monthly') {
                const montlyStart = startOfMonth(startDate);
                const montlyEnd = endOfMonth(endDate);
                formattedStartDate = format(montlyStart, 'yyyyMMdd');
                formattedEndDate = format(montlyEnd, 'yyyyMMdd');
            }

            axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalcars`, {
                params: {
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                },
            }).then(response => {
                console.log("API Response Data:", response.data);
                setChartData(response.data);
            }).catch(error => {
                console.error("Error fetching chart data:", error);
            });
        }
    };

    useEffect(() => {
        fetchChartData();
    }, [startDate, endDate, filter]);

    const data = {
        labels: chartData.map(carsType => carsType.car_type_name),  // 차종 이름
        datasets: [
            {
                // reservation_code 가 null, undefined,숫자가 아니면 0
                data: chartData.map(reservations => Number(reservations.reservation_code) || 0),  // 예약 건수
                backgroundColor: ['red', 'green', 'blue', 'yellow', 'purple'],
            },
        ],
    };

    const options = {
        scales: {
            y: {
                ticks: {
                    stepSize: 1, // Y축 단위를 1로 설정
                    callback: function (value) {
                        return Number.isInteger(value) ? value : null; // 정수만 표시
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            // 범례 숨기기
            title: {
                display: true, // 제목 표시
                text: '예약 건수', // 제목 내용
                align: 'start', // 제목을 왼쪽 정렬
            },
        },
    };

    return (
        <div className="reservation-statistics-list">
            <div className="daily-and-monthly-filter-head">
                <div>● 차종별 예약 통계 </div>
            </div>

            {/* 일별, 월별 필터 */}
            <div className="daily-and-monthly-filter-row">
                <select className="manager-row-column h6" value={filter} onChange={handleFilterChange}>
                    <option className="option-dropdown" value="daily">일별</option>
                    <option className="option-dropdown" value="monthly">월별</option>
                </select>
                <div className="date-picker-container">
                    <label className="manager-label">시작일: </label>
                    <DatePicker
                        locale={ko}
                        dateFormat={filter === 'daily' ? "yyyy년 MM월 dd일" : "yyyy년 MM월"}
                        dateFormatCalendar={filter === 'daily' ? "yyyy년 MM월" : "yyyy년"}
                        showMonthYearPicker={filter === 'monthly'}
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        placeholderText={filter === 'daily' ? "시작 날짜 선택" : "시작 월 선택"}
                        startDate={startDate}
                        endDate={endDate}
                        maxDate={new Date()}
                    />
                </div>
                <div className="date-picker-container">
                    <label className="manager-label">종료일: </label>
                    <DatePicker
                        locale={ko}
                        dateFormat={filter === 'daily' ? "yyyy년 MM월 dd일" : "yyyy년 MM월"}
                        dateFormatCalendar={filter === 'daily' ? "yyyy년 MM월" : "yyyy년"}
                        showMonthYearPicker={filter === 'monthly'}
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        placeholderText={filter === 'daily' ? "종료 날짜 선택" : "종료 월 선택"}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        maxDate={new Date()}
                    />
                </div>
            </div>
            <div className="chart-container">
                <h3>{filterText}</h3>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};
export default AllCarTypeReservationChart