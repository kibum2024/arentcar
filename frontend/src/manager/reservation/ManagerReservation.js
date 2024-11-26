import React, { useState, useEffect } from "react";
import axios from "axios";
import "manager/reservation/ManagerReservation.css";
import "index.css";
import { refreshAccessToken, handleLogout } from "common/Common";

const ManagerReservation = () => {
  // 상태 관리
  const [branchNames, setBranchNames] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [reserverName, setReserverName] = useState("");
  const [isPopUp, setIsPopUp] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [columnDefs] = useState([
    { titlename: "예약 ID", field: "reservation_code", width: 100, align: "center" },
    { titlename: "성함", field: "user_name", width: 100, align: "center" },
    { titlename: "차량번호", field: "car_number", width: 100, align: "center" },
    { titlename: "차량명", field: "car_type_name", width: 200, align: "center" },
    { titlename: "대여지점", field: "rental_location_name", width: 100, align: "center" },
    { titlename: "대여일", field: "rental_date", width: 150, align: "center" },
    { titlename: "반납일", field: "return_date", width: 150, align: "center" },
    { titlename: "", field: "", width: 100, align: "center" }, // 상세버튼 공백 열
  ]);

  // 초기 데이터 가져오기
  useEffect(() => {
    handleFetchBranchNames();
    handleFetchAllReservations();
  }, []);

  // 전체 예약 데이터 가져오기
  const handleFetchAllReservations = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setReservations(response.data); // 전체 데이터 설정
    } catch (error) {
      console.error("전체 예약 데이터를 가져오는 중 오류 발생", error);
    }
  };

  // 필터링된 예약 데이터 가져오기 (검색 버튼 클릭 시 호출)
  const handleFetchFilteredReservations = async () => {
    const params = {
      rentalLocationName: selectedBranch,
      rentalDate: reservationDate.replace("-",""),
      userName: reserverName,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/reservations`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setReservations(response.data); // 필터링된 데이터 설정

    } catch (error) {
      console.error("전체 예약 데이터를 가져오는 중 오류 발생", error);
    }
  };

  // 지점명 데이터 가져오기
  const handleFetchBranchNames = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/branchs`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setBranchNames(response.data.map((branch) => branch.branch_name));
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/branchs`, {
            headers: { Authorization: `Bearer ${newToken}` },
            withCredentials: true,
          });
          setBranchNames(response.data.map((branch) => branch.branch_name));
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error("지점명 데이터를 가져오는 중 오류가 발생했습니다.", error);
      }
    }
  };
  // 팝업 열기 및 닫기
  const handleDetailClick = (reservations) => {
    setIsPopUp(true);
  };

  const handlePopupClodeClick = () => {
    setIsPopUp(false);
  };

  return (
    <div className="manager-reservation-wrap">
      {/* 헤더 */}
      <div className="manager-reservation-header-wrap">
        <div className="manager-reservation-title-wrap">
          <div className="manager-reservation-title manager-title">● 예약현황</div>
        </div>
        <div className="manager-reservation-controls-wrap">
          <input
            type="text"
            placeholder="예약자 성함"
            value={reserverName}
            onChange={(e) => setReserverName(e.target.value)}
            className="manager-reservation-text-input"
          />
          <select
            className="manager-reservation-select"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">대여지점</option>
            {branchNames.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
            className="manager-reservation-date-input"
          />
          <button
            onClick={handleFetchFilteredReservations}
            className="manager-reservation-button-search manager-button manager-button-search"
          >
            검색
          </button>
        </div>
      </div>

      {/* 테이블 헤더 */}
      <div className="manager-reservation-content-header-row-wrap">
        {columnDefs.map((title, index) => (
          <div
            key={index}
            className="manager-reservation-content-header-column manager-head-column"
            style={{
              width: `${title.width}px`,
              textAlign: title.align || "center",
            }}
          >
            {title.titlename}
          </div>
        ))}
      </div>

      {/* 테이블 데이터 */}
      <div className="manager-reservation-content-list-wrap">
        {reservations.length > 0 ? (
          reservations.map((reservation, index) => (
            <div key={index} className="manager-reservation-content-item">
              {columnDefs.map((column, colIndex) => (
                <div
                  key={colIndex}
                  className="manager-reservation-content-column manager-row-column"
                  style={{
                    ...(column.field === "" ? { display: "flex" } : ""),
                    ...(column.field === "" ? { alignItems: "center" } : ""),
                    ...(column.field === "" ? { justifyContent: "center" } : ""),
                    width: `${column.width}px`,
                    textAlign: column.align || "center",
                  }}
                >
                  {column.field === "" ? (
                    <button
                      className="manager-reservation-content-button-detail manager-button"
                      onClick={() => handleDetailClick(reservations)}
                    >
                      상세
                    </button>
                  ) : (
                    reservation[column.field]
                  )}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="manager-reservation-content-no-data">예약 데이터가 없습니다.</div>
        )}
      </div>

      {/* 팝업 */}
      {isPopUp &&
        <div className='manager-reservation-popup manager-popup'>
          <div className='manager-reservation-content-popup-wrap'>
            <div className='manager-reservation-content-popup-close'>
              <div className='manager-popup-title'>● 예약상세</div>
              <div className='manager-reservation-content-popup-button'>
                <button className='manager-button manager-button-close' onClick={handlePopupClodeClick}>닫기</button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default ManagerReservation;
