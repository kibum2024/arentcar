import React, { useState, useEffect } from "react";
import axios from "axios";
import { refreshAccessToken, handleAdminLogout } from 'common/Common';
import Loading from 'common/Loading';
import "manager/carinfo/CarInfo.css";

const RentalCarInfo = ({ onClick }) => {
  const [vehicles, setVehicles] = useState([])
  const [isPopUp, setIsPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [workMode, setWorkMode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [carMenuOptions, setCarMenuOptions] = useState([]);
  const [branchMenuOptions, setBranchMenuOptions] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 15;
  const [totalCount, setTotalCount] = useState(0);
  const [availableRentalCarsCount, setAvailableRentalCarsCount] = useState(0);
  const [rentedRentalCarsCount, setRentedRentalCarsCount] = useState(0);
  const [maintenanceRentalCarsCount, setMaintenanceRentalCarsCount] = useState(0);
  
  const [columnDefs] = useState([
    { headerName: '코드', field: 'car_code', width: 75, align: 'center' },
    { headerName: '차종명', field: 'car_type_name', width: 150, align: 'center' },
    { headerName: '차량번호', field: 'car_number', width: 150, align: 'center' },
    { headerName: '차량상태', field: 'car_status', width: 75, align: 'center' },
    { headerName: '지점명', field: 'branch_name', width: 75, align: 'center' },
    { headerName: '차종구분', field: 'car_type_category', width: 75, align: 'center' },
    { headerName: '국산/수입', field: 'origin_type', width: 75, align: 'center' },
    { headerName: '인승', field: 'seating_capacity', width: 75, align: 'center' },
    { headerName: '연료', field: 'fuel_type', width: 75, align: 'center' },
    { headerName: '제조사', field: 'car_manufacturer', width: 75, align: 'center' },
    { headerName: '년식', field: 'model_year', width: 75, align: 'center' },
    { headerName: '작업', field: '', width: 200, align: 'center' },
  ]);

  const [carCode, setCarCode] = useState("");
  const [carTypeCode, setCarTypeCode] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [modelYear, setModelYear] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [carStatus, setCarStatus] = useState("");

  const optionsMenuBranchCode = [
    { value: 1, label: '수원 본점' },
    { value: 2, label: '용인점' },
    { value: 3, label: '오산점' },
    { value: 4, label: '화성점' },
    { value: 5, label: '평택점' },
    { value: 6, label: '광명점' },
    { value: 7, label: '제주점' },
    { value: 8, label: '대구 본점' },
    { value: 9, label: '부산점' },
    { value: 10, label: '대전점' },
    { value: 11, label: '전주점' },
    { value: 12, label: '순창점' },
    { value: 13, label: '춘천점' },
  ];

  const optionsMenuCarStatus = [
    { value: '01', label: '렌탈가능' },
    { value: '02', label: '렌탈중' },
    { value: '03', label: '정비중' },
  ];

  const pageingVehicles = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await getVehicles(token);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getVehicles(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleAdminLogout();
        }
      } else {
        console.error('There was an error fetching the vehicles pageing!', error);
      }
    }
  };

  const getVehicles = async (token) => {
    const params = {
      pageSize,
      pageNumber,
    };

    if (searchName && searchName.trim() !== '') {
      params.carNumber = searchName;
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalcars/paged`, 
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });

    if (response.data) {
      // console.log(response.data);
      setVehicles(response.data);
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
          handleAdminLogout();
        }
      } else {
        console.error('There was an error fetching the vehicles count!', error);
      }
    }
  };

  const getCount = async (token) => {
    const params = searchName ? { carNumber: searchName } : {};

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalcars/count`,
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

  const getAvailabelRentalCarsCount = async (carStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      await getAvailableRentalCarsByStatus(token, carStatus);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getAvailableRentalCarsByStatus(newToken, carStatus);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleAdminLogout();
        }
      } else {
        console.error('There was an error fetching the vehicles pageing!', error);
      }
    }
  };

  const getAvailableRentalCarsByStatus = async (token, carStatus) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalcars/count/${carStatus}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });

    if (response.data) {
      // console.log(response.data);
      setAvailableRentalCarsCount(response.data);
    }
  };

  const getRentedRentalCarsCount = async (carStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      await getRentedRentalCarsByStatus(token, carStatus);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getRentedRentalCarsByStatus(newToken, carStatus);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleAdminLogout();
        }
      } else {
        console.error('There was an error fetching the vehicles pageing!', error);
      }
    }
  };

  const getRentedRentalCarsByStatus = async (token, carStatus) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalcars/count/${carStatus}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });

    if (response.data) {
      // console.log(response.data);
      setRentedRentalCarsCount(response.data);
    }
  };

  const getMaintenanceRentalCarsCount = async (carStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      await getMaintenanceRentalCarsCountByStatus(token, carStatus);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getMaintenanceRentalCarsCountByStatus(newToken, carStatus);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleAdminLogout();
        }
      } else {
        console.error('There was an error fetching the vehicles pageing!', error);
      }
    }
  };

  const getMaintenanceRentalCarsCountByStatus = async (token, carStatus) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalcars/count/${carStatus}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });

    if (response.data) {
      // console.log(response.data);
      setMaintenanceRentalCarsCount(response.data);
    }
  };

  useEffect(() => {
    pageingVehicles();
    getTotalCount();
    getAvailabelRentalCarsCount("01");
    getRentedRentalCarsCount("02");
    getMaintenanceRentalCarsCount("03");
  }, [pageNumber]);

  useEffect(() => {
    const fetchCarMenus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        await getCarMenuOptions(token);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await getCarMenuOptions(newToken);
          } catch (refreshError) {
            alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
            handleAdminLogout();
          }
        } else {
          console.error('There was an error fetching the carMenu!', error);
        }
      }
    };

    const fetchBranchMenus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        await getBranchMenuOptions(token);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await getBranchMenuOptions(newToken);
          } catch (refreshError) {
            alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
            handleAdminLogout();
          }
        } else {
          console.error('There was an error fetching the branchMenu!', error);
        }
      }
    };

    fetchCarMenus();
    fetchBranchMenus();
  }, []);

  const getCarMenuOptions = async (token) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalcars/car/option`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true, 
    });
    setCarMenuOptions(response.data);
  };

  const getBranchMenuOptions = async (token) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalcars/branch/option`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true, 
    });
    setBranchMenuOptions(response.data);
  };

  const handleUpdateClick = (updateData, workMode) => {
    setIsPopUp(true);
    setWorkMode(workMode);
    setCarCode(updateData.car_code);
    setCarTypeCode(updateData.car_type_code); // carTypeName으로 가져온(GET) 데이터를 다시 carTypeCode로 서버에 보내기위해 DB에서 전달(GET) 받은 데이터 이용
    setCarNumber(updateData.car_number);
    setModelYear(updateData.model_year)
    setBranchCode(updateData.branch_code); // branchName으로 가져온(GET) 데이터를 다시 branchCode로 서버에 보내기위해 DB에서 전달(GET) 받은 데이터 이용
    setCarStatus(updateData.car_status_code); // String타입으로 가져온(GET) 데이터를 다시 Char(2)타입으로 서버에 보내기위해 DB에서 전달(GET) 받은 code 이용
  };

  const viewDataInit = () => {
    setCarCode("");
    setCarTypeCode("05");
    setCarNumber("")
    setModelYear("");
    setBranchCode("01");
    setCarStatus("01");
  };

  const handleSearchClick = async () => {
    pageingVehicles();
    getTotalCount();
    setPageNumber(1);
  };

  const handleDetailSearchClick = async () => {
    pageingVehicles();
    getTotalCount();
   };

  const handleInsertClick = (workMode) => {
    setIsPopUp(true);
    setWorkMode(workMode);
    viewDataInit();
  };

  const handleDeleteClick = async (carCode) => {
    if (window.confirm('차량을 정말로 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('accessToken');
        await deleteVehicle(token, carCode);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await deleteVehicle(newToken, carCode);
          } catch (error) {
            alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
            handleAdminLogout();
          }
        } else {
          alert("삭제 중 오류가 발생했습니다." + error);
        }
      }
    }
  };

  const deleteVehicle = async (token, carCode) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalcars/${carCode}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true,
    });
    setVehicles((prevVehicle) => prevVehicle.filter(vehicle => vehicle.car_code !== carCode));
    alert("차량이 삭제되었습니다.");
  };

  const handleDataSaveClick = async () => {
    if (!validateCheck()) {
      return; 
    }

    const newVehicle = {
      car_code: carCode,
      car_type_code: carTypeCode,
      car_number: carNumber,
      model_year: modelYear,
      branch_code: branchCode,
      car_status: carStatus,
    };

    if (workMode === "수정") {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        await updateVehicle(token, newVehicle);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await updateVehicle(newToken, newVehicle);
          } catch (error) {
            alert("인증이 만료되었습니다. 다시 로그인 해주세요." + error);
            handleAdminLogout();
          }
        } else {
          alert("차량 수정 중 오류가 발생했습니다." + error);
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        await createVehicle(token, newVehicle);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await createVehicle(newToken, newVehicle);
          } catch (error) {
            alert("인증이 만료되었습니다. 다시 로그인 해주세요." + error);
            handleAdminLogout();
          }
        } else {
          alert("차량 등록 중 오류가 발생했습니다." + error);
        }
      } finally {
        setLoading(false);
      }
    }

    setIsPopUp(false);
  };

  const updateVehicle = async (token, newVehicle) => {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/arentcar/manager/rentalcars/${carCode}`,
      newVehicle,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    setVehicles((prevVehicle) => prevVehicle.map(vehicle => vehicle.car_code === carCode ? newVehicle : vehicle));
    alert("차량이 수정되었습니다.");
  };
  
  const createVehicle = async (token, newVehicle) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalcars`, 
      newVehicle, // Spring Boot에서 @RequestBody로 받는 객체 데이터
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });

    const savedVehicle = response.data;
    newVehicle.car_code = response.data.car_code;
    newVehicle.car_password = response.data.car_password;
    setVehicles((prevVehicle) => [...prevVehicle, savedVehicle]);
    alert("차량이 등록되었습니다.");
  };

  const handlePopupCloseClick = () => {
    setIsPopUp(false);
  };

  const handleCloseClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const validateCheck = () => {
    if (!carTypeCode || carTypeCode.trim() === '') {
      alert("차종명을 선택해주세요.");
      return false;
    };
    if (!carNumber || carNumber.trim() === '') {
      alert("차량번호를 입력해주세요.");
      return false;
    };
    if (!modelYear || modelYear.trim() === '') {
      alert("년식을 입력해주세요.");
      return false;
    };

    return true; 
  };

  const totalWidth = columnDefs.reduce((sum, columnDef) => {
    return sum + (columnDef.width ? columnDef.width : 150);
  }, 0);

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const handleDownloadExcel = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await getRentalCarsExcel(token);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getRentalCarsExcel(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleAdminLogout();
        }
      } else {
        console.error('There was an error fetching the rental cars excel!', error);
      }
    }
  };

  const getRentalCarsExcel = async (token) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalcars/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob', // 서버에서 파일을 blob 형태로 받기 위해 설정
          withCredentials: true,
        });

      // 파일 다운로드를 위한 URL 생성
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rentalcars.xlsx'); // 다운로드할 파일 이름 설정, download속성은 링크로 연결되지 않고 대신 해당 콘텐츠가 다운로드됨을 명시함
      document.body.appendChild(link);
      link.click(); // 링크를 클릭하여 파일 다운로드를 시작한다
      link.remove(); // 다운로드 후 <a>태그를 DOM에서 제거한다

    } catch (error) {
      console.error('Error downloading the Excel file', error);
    }
  };

  let totalPages = Math.ceil(totalCount / pageSize);
  if (totalPages < 1) {
    totalPages = 1;
  }

  return (
    <div className="car-info-wrap">
      <div className="car-info-header-wrap">
        <div className="car-info-title-wrap">
          <div className="manager-title">● 차량관리</div>
        </div>
        <div
          className='car-info-button-wrap'
          style={{ width: `${totalWidth}px` }}
        >
          <div className='flex-align-center'>
            <label className='manager-label' htmlFor="">차량번호</label>
            <input className='width200' type="text" value={searchName} onChange={(e) => (setSearchName(e.target.value))}/>
            <button className='manager-button manager-button-search' onClick={() => handleSearchClick()}>검색</button>
            <button className='manager-button manager-button-search' onClick={() => handleDetailSearchClick()}>상세검색</button>
            <span>[검색건수 : {totalCount}건]</span>
          </div>
          <div>
            <button className='manager-button manager-button-insert' onClick={() => handleInsertClick("등록")}>추가</button>
            <button className='manager-button manager-button-close' onClick={() => handleCloseClick()}>닫기</button>
          </div>
        </div>
      </div>

      <div className="car-info-content-wrap">
        <div className="car-info-content-header">
          {columnDefs.map((title, index) => (
           <div key={index} className='manager-head-column' style={{ width: `${title.width}px`, textAlign: `center` }}>{title.headerName}</div>
          ))}
        </div>
        <div className="car-info-content-row-wrap">
          {vehicles.map((row, index) => (
            <div key={index} className='register-menu-content-row'>
              {columnDefs.map((title, index) => ( // vehicles.map 안에 columnDefs.map이 있는 이유는 각 차량(row)의 정보를 열(title)에 맞춰 표시하기 위함
                                                  // 즉, 각 차량(row)에 대해 모든 열을(title) 반복하여 해당 차량의 각 필드 값(titile.field)을 표시함
                <div
                  key={index} className='manager-row-column'
                  style={{
                    ...(title.field === '' ? { display: 'flex' } : ''),
                    ...(title.field === '' ? { alignItems: 'center' } : ''),
                    ...(title.field === '' ? { justifyContent: 'center' } : ''),
                    width: `${title.width}px`,
                    textAlign: `${title.align}`
                  }}
                >
                  {title.field === '' ? (
                    <>
                      <button className='manager-button manager-button-update' onClick={() => handleUpdateClick(row, "수정")}>수정</button>
                      <button className='manager-button manager-button-delete' onClick={() => handleDeleteClick(row.car_code)}>삭제</button>
                    </>
                  ) : (
                      row[title.field]
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {isPopUp &&
          <div className='manager-popup'>
            <div className='car-info-content-popup-wrap'>
              <div className='car-info-content-popup-close'>
                <div className='manager-popup-title'>● 차량{workMode}</div>
                <div className='car-info-content-popup-button'>
                  <button className='manager-button manager-button-save' onClick={handleDataSaveClick}>저장</button>
                  <button className='manager-button manager-button-close' onClick={handlePopupCloseClick}>닫기</button>
                </div>
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="carCode">차량코드</label>
                <input className='width50  word-center' id="carCode" type="text" value={carCode} disabled />
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="carTypeCode">차종명</label>
                <select className='width100' id="carTypeCode" value={carTypeCode} onChange={(e) => (setCarTypeCode(e.target.value))}>
                  {carMenuOptions.map((option) => (
                    <option key={option.car_type_code} value={option.car_type_code}>
                      {option.car_type_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="carNumber">차량번호</label>
                <input className='width100  word-center' id="carNumber" type="text" placeholder="01가1001" value={carNumber} onChange={(e) => {setCarNumber(e.target.value)}} />
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="modelYear">년식</label>
                <input className='width100  word-center' id="modelYear" type="text" placeholder="2024" value={modelYear} onChange={(e) => {setModelYear(e.target.value)}} />
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="branchCode">지점명</label>
                <select className='width100' id="branchCode" value={branchCode} onChange={(e) => (setBranchCode(e.target.value))}>
                  {branchMenuOptions.map((option) => (
                    <option key={option.branch_code} value={option.branch_code}>
                      {option.branch_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="carStatus">차량상태</label>
                <select className='width100' id="carStatus" value={carStatus} onChange={(e) => (setCarStatus(e.target.value))}>
                  {optionsMenuCarStatus.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        }
      </div>

      <div className='car-info-pageing-wrap flex-align-center'>
        <button 
          className='manager-button'
          style={{color: pageNumber === 1 ?  '#aaa' : 'rgb(38, 49, 155)'}} 
          onClick={() => handlePageChange(pageNumber - 1)} 
          disabled={pageNumber === 1}
        >이전</button>
        <div className='car-info-pageing-display'>{pageNumber} / {totalPages}</div>
        <button 
          className='manager-button' 
          style={{color: pageNumber === totalPages ?  '#aaa' : 'rgb(38, 49, 155)'}} 
          onClick={() => handlePageChange(pageNumber + 1)} 
          disabled={pageNumber === totalPages}
        >다음</button>
      </div>

      <div className="car-info-status-wrap flex-align-center">
        <div className="car-info-status-display car-info-status-display-main">전체차량<div className="car-info-status-content car-info-status-content-main">{totalCount}</div></div>
        <div className="car-info-status-display">대여가능<div className="car-info-status-content">{availableRentalCarsCount}</div></div>
        <div className="car-info-status-display">대여중<div className="car-info-status-content">{rentedRentalCarsCount}</div></div>
        <div className="car-info-status-display">정비중<div className="car-info-status-content">{maintenanceRentalCarsCount}</div></div>
        <div className="car-info-status-display">
          <div className="car-info-status-excel">
            <button onClick={handleDownloadExcel}>
              <img className="car-info-excel-download" src={`${process.env.REACT_APP_IMAGE_URL}/excel-logo.png`} alt="rentalCars excel downlod button" />
            </button>
          </div>
        </div>
      </div>

      {loading && (<Loading />)}
      </div>
  );
};

export default RentalCarInfo;
