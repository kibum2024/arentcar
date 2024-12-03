import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { refreshAccessToken, handleLogout } from 'common/Common';
import { formatDate } from "common/Common";
import 'manager/managepayment/ManagePayment.css';
import 'index.css';

const ManagePayment = () => {
  const [branchNames, setBranchNames] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const [isPopUp, setIsPopUp] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);
  const [managePayment, setManagePayment] = useState([]);
  const [managePaymentDetails, setManagePaymentDetails] = useState({});

  const [columnDefs] = useState([
    { headerName: '예약번호', field: 'reservation_code', width: 100, align: 'center' },
    { headerName: '회원명', field: 'user_name', width: 120, align: 'center' },
    { headerName: '지점', field: 'branch_name', width: 120, align: 'center' },
    { headerName: '차종', field: 'car_type', width: 120, align: 'center' },
    { headerName: '렌트일', field: 'rental_date', width: 120, align: 'center' },
    { headerName: '렌트기간', field: 'rental_period', width: 300, align: 'center' },
    { headerName: '결제금액', field: 'payment_amount', width: 120, align: 'center' },
    { headerName: '상세보기', field: '', width: 120, align: 'center' },
  ]);

  const pageingManagePayment = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await getManagePayment(token);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getManagePayment(newToken);
        } catch (error) {
          alert('인증이 만료되었습니다. 다시 로그인 해주세요.');
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the menus paging!', error);
      }
    }
  };

  // 결제정보 리스트
  const getManagePayment = async (token) => {
    try {
      const params = { 
        pageSize, 
        pageNumber, 
        };

      // 조건이 참일 때만 필드 추가
    if (selectedBranch && selectedBranch.trim() !== '') {
      params.branchName = selectedBranch;
    }
    if (reservationDate) {
      params.rentalDate = reservationDate;
    }
    if (searchName && searchName.trim() !== '') {
      params.userName = searchName;
    }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalrates`, 
        {
        params,
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        withCredentials: true,
      });

      if ( response.data && response.data.length > 0) {
        setManagePayment(response.data);
      } else {
        setManagePayment([]);
      }
    } catch (error) {
      console.error('오류 발생 확인 하세요:', error);
    }
  };

  const getTotalCount = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await getCount(token);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getCount(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the RentalRates count!', error);
      }
    }
  };

  const getCount = async (token) => {
    const params = {
      ...((selectedBranch && { branchNames: selectedBranch }) || {}),
      ...((reservationDate && { rentalDate: reservationDate }) || {}),
      ...((searchName && { userName: searchName }) || {}),
    };

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalrates/count`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });

    if (typeof response.data === 'number') {
      setTotalCount(response.data);
    } else {
      console.error('Unexpected response:', response.data);
    }
  };

  // 지점명 가져오기
  const handleFetchBranchNames = async () => {
    let token = localStorage.getItem("accessToken");

    try {
      await fetchBranchNamesData(token); // 기존 토큰으로 데이터 요청
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          token = await refreshAccessToken(); // 새 토큰 발급
          await fetchBranchNamesData(token); // 새 토큰으로 데이터 요청
        } catch (refreshError) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout(); // 로그아웃 처리
        }
      } else {
        console.error("지점명 데이터를 가져오는 중 오류가 발생했습니다.", error);
      }
    }
  };

  const fetchBranchNamesData = async (token) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/branchs`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    if (response.data) {
      setBranchNames(response.data.map((branch) => branch.branch_name)); // 데이터 설정
    }
  };

  // 팝업창 열기
  const fetchManagePaymentDetail = async (reservationCode) => {
    try {
      const token = localStorage.getItem('accessToken');
      await getManagePaymentDetails(token, reservationCode);
     } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getManagePaymentDetails(newToken, reservationCode);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요");
          handleLogout();
        }
      } else {
        console.error("There was an error fetching the managePayment details!", error);
      }
     } 
    };

    const getManagePaymentDetails = async (token, reservationCode) => {
      if (!reservationCode) {
        return;
      }
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalrates/detail/${reservationCode}`,
      {
        header: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    if (response.data) {
      setManagePaymentDetails(response.data)
      }
    };

    const handleDetailClick = (reservationCode) => {
      if (!reservationCode) {
        console.error("Invalid reservationCode:", reservationCode);
        return;
      }
      setIsPopUp(true);
      fetchManagePaymentDetail(reservationCode);
    };
    
  useEffect(() => {
    pageingManagePayment();
    getTotalCount();
    handleFetchBranchNames();
  }, [pageNumber, pageSize]);


  // 팝업창닫기
  const handlePopupCloseClick = () => {
    setIsPopUp(false);
    setManagePaymentDetails([]);
  }

  // 검색 조건 변경 후 초기화 코드
  const handleSearchClick = async () => {
    setPageNumber(1); // 검색 조건 변경 시 페이지 번호를 1로 초기화
    await pageingManagePayment(); // 데이터 다시 로드
    await getTotalCount(); // 총 데이터 개수 다시 로드
  };

  const handlePageChange = (newPage) => {
      setPageNumber(newPage);
    }

  let totalPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 1;

  return (
    <div className="manage-payment-wrap">
      {/* 헤더 */}
      <div className="manage-payment-header-wrap">
        <div className="manage-payment-title-wrap">
          <div className='manage-payment-title manager-title'>
            ● 결제 정보 확인
            </div>
        </div>

        {/* 검색창 */}
        <div className="manage-payment-search-wrap">
          <input 
          type="text" 
          placeholder="회원명" 
          value={searchName} 
          onChange={(e) => setSearchName(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
          className='manage=payment-text-input'
          />

          <select 
          className="manage-payment-select" 
          value={selectedBranch} 
          onChange={(e) => setSelectedBranch(e.target.value)}>

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
            className="manage-payment-reservation-date"
          />
          <button 
          className="manager-button manager-button-search" 
          onClick={handleSearchClick}
          >
            검색
          </button>
        </div>
      </div>

      {/* 테이블 헤더*/}
      <div className="manage-payment-content-header-row-wrap">
        {columnDefs.map((title, index) => (
          <div key={index} 
          className="manage-payment-content-header-column manager-head-column" 
          style={{ 
            width: `${title.width}px`, 
            textAlign: title.align || "center" 
            }}>
            {title.headerName}
          </div>
        ))}
      </div>

      {/* 테이블데이터 */}
      <div className="manage-payment-content-list-wrap">
        {managePayment.length > 0 ? (
          managePayment.map((row, rowIndex) => (
            <div 
            key={rowIndex} 
            className="manage-payment-content-item">
              {columnDefs.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className="manage-payment-content-column manager-row-column"
                  style={{
                    ...(col.field === "" ? { display: "flex" } : ""),
                    ...(col.field === "" ? { alignItems: "center" } : ""),
                    ...(col.field === "" ? { justifyContent: "center" } : ""),
                    width: `${col.width}px`,
                    textAlign: `${col.align}` || 'center',
                  }}
                >
                  {col.field === '' ? (
                    <button 
                    className="manage-payment-content-button-detail manager-button" 
                    onClick={() => handleDetailClick(row.reservation_code)}
                    >상세
                    </button>
                  ) : (
                    row[col.field]
                  )}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="manage-payment-content-no-data">표시할 데이터가 없습니다.</div>
        )}
      </div>

      {/* 팝업 */}
      {isPopUp && (
        <div className="manage-payment-detail-popup manager-popup">
          <div className="manage-payment-detail-content-popup-wrap">
            <div className="manage-payment-detail-content-popup-header-wrap">
              <div className="manager-popup-title">● 예약상세</div>
              <button
                className="manager-button manager-button-close"
                onClick={handlePopupCloseClick}
              >
                닫기
              </button>
            </div>

            {/* 예약 ID */}
            <div className="manage-payment-detail-popup-high-reservation-id">
              <label>예약ID : </label>
              <span>{managePaymentDetails.reservation_code}</span>
            </div>

            {/* 고객정보 */}
            <div className="manage-payment-detail-popup-section">
              <div className="manage-payment-detail-popup-section-title">고객정보</div>
              <div className="manage-payment-detail-popup-field-row">
                <label>성명 : </label>
                <span>{managePaymentDetails.user_name}</span>
              </div>
              <div className="manage-payment-detail-popup-field-row">
                <label>생년월일 : </label>
                <span>{formatDate(managePaymentDetails.user_birth_date)}</span>
                <label>연락처 : </label>
                <span>{managePaymentDetails.phone_number}</span>
              </div>
              <div className="manage-payment-detail-popup-field-row">
                <label>이메일 : </label>
                <span>{managePaymentDetails.user_email}</span>
                <label>면허증번호 : </label>
                <span>{managePaymentDetails.driver_license}</span>
              </div>
              <div className="manage-payment-detail-popup-field-row">
                <label>면허발급일 : </label>
                <span>{managePaymentDetails.driver_issue}</span>
                <label>면허갱신일 : </label>
                <span>{managePaymentDetails.driver_expiry}</span>
              </div>
            </div>

            {/* 결제 정보 */}
            <div className="manage-payment-detail-popup-section">
              <div className="manage-payment-detail-popup-section-title">결제 정보</div>
              <div className="manage-payment-detail-popup-field-row">
                <label>차량명 : </label>
                <span>{managePaymentDetails.car_type}</span>
                <label>대여일시 : </label>
                <span>{formatDate(managePaymentDetails.rental_date)}{' '}{managePaymentDetails.rental_time}</span>
              </div>
              <div className="manage-payment-detail-popup-field-row">
                <label>차량번호 :{' '}</label>
                <span>{managePaymentDetails.car_number}</span>
                <label>대여지점 : </label>
                <span>{managePaymentDetails.branch_name}</span>
              </div>
              <div className="manage-payment-detail-popup-field-row">
                <label>보험 : </label>
                <span>{managePaymentDetails.insurance_type}</span>
                <label>반납일시 : </label>
                <span>{formatDate(managePaymentDetails.return_date)}{' '}{managePaymentDetails.return_time}</span>
              </div>
              <div className="manage-payment-detail-popup-field-row">
                <label>렌트기간 : </label>
                <span>{managePaymentDetails.rental_period}</span>
              </div>
              <div className="manage-payment-detail-popup-field-row">
                <label>결제구분 : </label>
                <span>{managePaymentDetails.payment_category_name}</span>
                <label>결제방식 : </label>
                <span>{managePaymentDetails.payment_type_name}</span>
              </div>
              <div className="manage-payment-detail-popup-field-row">
                <label>결제금액 : </label>
                <span>{managePaymentDetails.payment_amount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 페이지네이션 */}
      <div className="manage-payment-pagination-wrap flex-align-center">
        <button 
        className="manager-button" 
        style={{color: pageNumber === 1 ?  '#aaa' : 'rgb(38, 49, 155)'}}
        onClick={() => handlePageChange(pageNumber - 1)} 
        disabled={pageNumber === 1}
        >이전
        </button>
        <div className='manage-payment-pagination-info'>
          {pageNumber} / {totalPages}
          </div>
        <button 
        className="manager-button" 
        style={{color: pageNumber === totalPages ?  '#aaa' : 'rgb(38, 49, 155)'}} 
        onClick={() => handlePageChange(pageNumber + 1)} 
        disabled={pageNumber === totalPages}
        >다음</button>
      </div>
    </div>
  );
};

export default ManagePayment;
