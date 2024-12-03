// 전체 지점 예약 통계
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



// 차트 라이브러리의 필요한 요소를 등록
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const AllBranchesReservationChart = () => {

    // 캘린더 시작 날짜와 종료 날짜
    const [startDate, setStartDate] = useState(subDays(new Date(), 7)); // 오늘 기준 일주일 전
    const [endDate, setEndDate] = useState(new Date()); // 오늘 날짜
    const [chartData, setChartData] = useState([]);
    // 선택된 일별 & 월별 필터 상태
    const [filter, setFilter] = useState('daily');

    // 일별, 월별 텍스트 필터
    const filterText = filter === 'daily' ? '일별 전체 지점 예약' : '월별 전체 지점 예약';

    // 일별, 월별 선택용 핸들러
    const handleFilterChange = (event) => {
        setFilter(event.target.value); // 선택된 값을 차트 이름에 반영
        setStartDate(null); //필터 변경 시 기존 날짜 초기화
        setEndDate(null);
    };

    // 일별 & 월별 클릭 시
    useEffect(() => {
        // 날짜가 선택된 경우에만 호출
        if (startDate && endDate) {
            let formattedStartDate, formattedEndDate;

            // 사용자가 '일별'을 클릭했다면
            if (filter === 'daily') {
                // 일별: yyyyMMdd 형식
                // / 포맷팅 안 하면 2024-11-04T15:00:00.000Z 식으로 옴 (T는 날짜와 시간, Z는 UTC)
                // yyyy-MM-dd 형식으로 추출 후 /-/g 를 통해 전체 문자열에서 하이픈 제거
                formattedStartDate = startDate.toISOString().slice(0, 10).replace(/-/g, '');
                formattedEndDate = endDate.toISOString().slice(0, 10).replace(/-/g, '');

                // 사용자가 '월별'을 클릭했다면
            } else if (filter === 'monthly') {
                const montlyStart = startOfMonth(startDate); // 시작된 선택일의 해당 월 첫날
                const montlyEnd = endOfMonth(endDate); // 시작된 선택일의 해당 월 마지막날
                formattedStartDate = format(montlyStart, 'yyyyMMdd');
                formattedEndDate = format(montlyEnd, 'yyyyMMdd');
                console.log(formattedStartDate, formattedEndDate);
            }

            // axios를 통해 json 형식으로 데이터를 가져옴
            axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/branchs/reservation`, {
                params: {
                    startDate: formattedStartDate,
                    endDate: formattedEndDate
                }
            }).then(response => {
                console.log("API Response Data:", response.data);
                setChartData(response.data);
            }).catch(error => {
                console.error("Error fetching chart data:", error);
            });
        }
    }, [startDate, endDate, filter]); // startDate, endDate가 변경될 때 호출

    // 데이터를 차트에 넘기기
    const data = {
        labels: chartData.map(branchsName => branchsName.branch_name),  // 지점 이름
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
            {/* 통계 필터 */}
            <div className="daily-and-monthly-filter-head">
                <div>● 전체 지점 예약 통계 </div>
            </div>

            {/* 일별, 월별 필터 */}
            <div className="daily-and-monthly-filter-row">
                <select className="manager-row-column h6" value={filter} onChange={handleFilterChange}>
                    <option className="option-dropdown" value="daily">일별</option>
                    <option className="option-dropdown" value="monthly">월별</option>
                </select>

                {/* 시작 날짜 */}
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
                        maxDate={new Date()} // 시작일, 종료일이 오늘 날짜 이상으로 넘어가지 않음

                    />
                </div>

                {/* 종료 날짜 */}
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
                        minDate={startDate} // 최소 기간은 선택한 날짜부터 시작 됨
                        maxDate={new Date()} // 시작일, 종료일이 오늘 날짜 이상으로 넘어가지 않음
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

export default AllBranchesReservationChart;
