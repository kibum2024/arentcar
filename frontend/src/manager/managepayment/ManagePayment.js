import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { refreshAccessToken, handleLogout } from 'common/Common';
import './ManagePayment.css';

const ManagePayment = ({ onClick }) => {

  const [rentalRates, setRentalRates] = useState([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [searchName, setSearchName] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [detailData, setDetailData] = useState(null);
  
  
  const [columnDefs] = useState([
    { headerName: 'ID', field: 'id', width: 100, align: 'center' },
    { headerName: '회원명', field: 'user_name', width: 120, align: 'center' },
    { headerName: '지점', field: 'branch_name', width: 120, align: 'center' },
    { headerName: '차종', field: 'car_type', width: 120, align: 'center' },
    { headerName: '렌트기간', field: 'rental_period', width: 140, align: 'center' },
    { headerName: '결제금액', field: 'payment_amount', width: 120, align: 'center' },
    { headerName: '상세보기', field: '', width: 120, align: 'center' },
  ]);

  useEffect(() => {
    pageingMenus();
    getTotalCount();
  }, [pageNumber, pageSize, searchName]);

  const pageingMenus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await getRentalRates(token);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getRentalRates(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the menus pageing!', error);
      }
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
        console.error('There was an error fetching the Menus count!', error);
      }
    }
  };


  const getRentalRates = async (token) => {
    const params = {
      pageSize,
      pageNumber,
    };
  
    try {
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalrates/paged`, 
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalrates`, 
        {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log("데이터 확인 :", response.data); // 데이터 확인
      if (response.data) {
        setRentalRates(response.data);
      }
    } catch (error) {
      console.error("오류 발생 확인 하세요:", error);
    }
  };
  

  const getCount = async (token) => {
    const params = searchName ? { menuName: searchName } : {};

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

  const fetchDetailData = async (id) => {
    try {
      const token = localStorage.getItem('accessToken'); // 인증 토큰 가져오기
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalrates/${id}`, 
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
  
      if (response.data) {
        console.log("Fetched detail data:", response.data); // 데이터 확인용 로그
        setDetailData(response.data); // 상세보기 데이터 상태에 저장
        setIsPopUp(true); // 팝업 창 열기
      }
    } catch (error) {
      console.error("Error fetching detail data:", error);
    }
  };

  const handlePopupCloseClick = () => {
    setIsPopUp(false);
  };
  
  let totalPages = Math.ceil(totalCount / pageSize);
  if (totalPages < 1) {
    totalPages = 1;
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) { // 유효한 범위인지 확인
      setPageNumber(newPage);
    }
  };


   return (
    <div className="manage-payment-wrap">

    {/* 테이블 영역 */}
    <div className="manage-payment-table-wrap">
      <div className="manage-payment-table-header-wrap">
        {columnDefs.map((col, index) => (
          <div
            key={index}
            className="manage-payment-table-column-wrap"
            style={{ width: col.width, textAlign: col.align }}
          >
            {col.headerName}
          </div>
        ))}
      </div>

      <div className="manage-payment-table-body-wrap">
        {rentalRates.length > 0 ? (
          rentalRates.map((row, rowIndex) => (
            <div key={rowIndex} className="manage-payment-table-row-wrap">
              {columnDefs.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className="manage-payment-table-cell-wrap"
                  style={{ width: col.width, textAlign: col.align }}
                >
                  {col.field ? (
                    row[col.field]
                  ) : (
                    col.headerName === '상세보기' && (
                      <button onClick={() => fetchDetailData(row.id)}>
                        상세보기
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="no-data-message">표시할 데이터가 없습니다.</div>
        )}
      </div>
    </div>

    {/* 팝업 상세보기 */}
    {isPopUp && detailData && (
      <div className="manage-payment-popup-wrap">
        <div className="manage-payment-popup-content-wrap">
          <button onClick={handlePopupCloseClick} className="manage-payment-popup-close-btn">
            닫기
          </button>
          <h2>상세 정보</h2>
          <table>
            <tbody>
              {Object.entries(detailData).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* 페이지네이션 */}
    <div className="manage-payment-pagination-wrap">
      <button
        onClick={() => handlePageChange(pageNumber - 1)}
        disabled={pageNumber === 1}
      >
        이전
      </button>
      <span>
        {pageNumber} / {Math.ceil(totalCount / pageSize)}
      </span>
      <button
        onClick={() => handlePageChange(pageNumber + 1)}
        disabled={pageNumber === Math.ceil(totalCount / pageSize)}
      >
        다음
      </button>
    </div>
    </div>
  );
};

export default ManagePayment;

