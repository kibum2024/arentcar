import React, { useState, useEffect } from "react";
import axios from "axios";
import { refreshAccessToken, handleLogout } from 'common/Common';
import Loading from 'common/Loading';
import "manager/carinfo/CarInfo.css";

const RentalCarInfo = ({ onClick }) => {
  const [vehicles, setVehicles] = useState([])
  const [isPopUp, setIsPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [workMode, setWorkMode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 15;
  const [totalCount, setTotalCount] = useState(0);
  // const [availableRentalCarsCount, setAvailableRentalCarsCount] = useState(0);

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

  const optionsMenuCarTypeCode = [
    { value: 5, label: '레이' },
    { value: 6, label: '캐스퍼' },
    { value: 7, label: '모닝' },
    { value: 8, label: '스파크' },
    { value: 9, label: '레이(더뉴)' },
  ];

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
          handleLogout();
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
          handleLogout();
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

  // const getRentalCarsCount = async (carStatus) => {
  //   try {
  //     const token = localStorage.getItem('accessToken');
  //     await getAvailabelRentalCarsCount(token, carStatus);
  //   } catch (error) {
  //     if (error.response && error.response.status === 403) {
  //       try {
  //         const newToken = await refreshAccessToken();
  //         await getAvailabelRentalCarsCount(newToken, carStatus);
  //       } catch (error) {
  //         alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
  //         handleLogout();
  //       }
  //     } else {
  //       console.error('There was an error fetching the vehicles pageing!', error);
  //     }
  //   }
  // };

  // const getAvailabelRentalCarsCount = async (token, carStatus) => {
  //   const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalcars/count/${carStatus}`, 
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       },
  //       withCredentials: true,
  //     });

  //   if (response.data) {
  //     // console.log(response.data);
  //     setAvailableRentalCarsCount(response.data);
  //   }
  // };

  useEffect(() => {
    pageingVehicles();
    getTotalCount();
    // getRentalCarsCount();
  }, [pageNumber]);

  const handleUpdateClick = (updateData, workMode) => {
    setIsPopUp(true);
    setWorkMode(workMode);
    setCarCode(updateData.car_code);
    setCarTypeCode(updateData.car_type_code);
    setCarNumber(updateData.car_number);
    setModelYear(updateData.model_year)
    setBranchCode(updateData.branch_code);
    setCarStatus(updateData.car_status);
  };

  const viewDataInit = () => {
    setCarCode("");
    setCarTypeCode("01");
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
    if (window.confirm('자료를 정말로 삭제하시겠습니까?')) {
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
            handleLogout();
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
    alert("자료가 삭제되었습니다.");
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
            handleLogout();
          }
        } else {
          alert("수정 중 오류가 발생했습니다." + error);
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
            handleLogout();
          }
        } else {
          alert("등록 중 오류가 발생했습니다." + error);
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
    alert("자료가 수정되었습니다.");
  };
  
  const createVehicle = async (token, newVehicle) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/arentcar/manager/rentalcars`, 
      newVehicle,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });
    newVehicle.car_code = response.data.car_code;
    newVehicle.car_password = response.data.car_password;
    setVehicles((prevVehicle) => [...prevVehicle, newVehicle]);
    alert("자료가 등록되었습니다.");
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
      alert("차종코드를 선택해주세요.");
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
    if (!branchCode || branchCode.trim() === '') {
      alert("지점코드를 선택해주세요.");
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
              {columnDefs.map((title, index) => (
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
                <label className='width80 word-right label-margin-right' htmlFor="">차량코드</label>
                <input className='width50  word-center' type="text" value={carCode} disabled />
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">차종코드</label>
                <select className='width100' id="comboBox" value={carTypeCode} onChange={(e) => (setCarTypeCode(e.target.value))}>
                  {optionsMenuCarTypeCode.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">차량번호</label>
                <input className='width100  word-center' type="text" placeholder="01가1001" value={carNumber} onChange={(e) => {setCarNumber(e.target.value)}} />
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">년식</label>
                <input className='width100  word-center' type="text" placeholder="2024" value={modelYear} onChange={(e) => {setModelYear(e.target.value)}} />
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">지점코드</label>
                <select className='width100' id="comboBox" value={branchCode} onChange={(e) => (setBranchCode(e.target.value))}>
                  {optionsMenuBranchCode.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">차량상태</label>
                <select className='width100' id="comboBox" value={carStatus} onChange={(e) => (setCarStatus(e.target.value))}>
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

      {/* <div className="flex-align-center">
        <div>{availableRentalCarsCount}</div>
        <div></div>
        <div></div>
        <div></div>
      </div> */}

      {loading && (<Loading />)}
      </div>
  );
};

export default RentalCarInfo;
