import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { refreshAccessToken, handleAdminLogout } from 'common/Common';
import Loading from 'common/Loading';
import "manager/carinfo/CarInfo.css";

const CarInfo = ({ onClick }) => {
  const [vehicles, setVehicles] = useState([]) // DB에서 읽어온 차종 데이터를 배열로 담기
  const [isPopUp, setIsPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [workMode, setWorkMode] = useState("");
  const [searchName, setSearchName] = useState(""); 
  const [pageNumber, setPageNumber] = useState(1); // 현재 페이지 번호(기본 1페이지)가 변경 될때마다 pageingVehicles(), getTotalCount() 함수 호출,
                                                   // pageingVehicles() 함수는 pageNumber(기본 1페이지, -1 또는 +1씩 가감)와 pageSize를 서버로 보내고 LIMIT와 OFFSET으로 적절한 데이터를 불러온다
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0); // 전체 차종 수(검색건수 표시, 페이지네이션)

  const [columnDefs] = useState([
    { headerName: '코드', field: 'car_type_code', width: 85, align: 'center' },
    { headerName: '차종구분', field: 'car_type_category', width: 85, align: 'center' },
    { headerName: '국산/수입', field: 'origin_type', width: 85, align: 'center' },
    { headerName: '차종명', field: 'car_type_name', width: 150, align: 'center' },
    { headerName: '인승', field: 'seating_capacity', width: 85, align: 'center' },
    { headerName: '연료', field: 'fuel_type', width: 85, align: 'center' },
    { headerName: '속도제한', field: 'speed_limit', width: 85, align: 'center' },
    { headerName: '면허제한', field: 'license_restriction', width: 85, align: 'center' },
    { headerName: '제조사', field: 'car_manufacturer', width: 85, align: 'center' },
    { headerName: '년식', field: 'model_year', width: 85, align: 'center' },
    { headerName: '작업', field: '', width: 200, align: 'center' },
  ]);

  const [carTypeCode, setCarTypeCode] = useState("");
  const [carTypeCategory, setCarTypeCategory] = useState("");
  const [originType, setOriginType] = useState("");
  const [carTypeName, setCarTypeName] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [speedLimit, setSpeedLimit] = useState("");
  const [licenseRestriction, setLicenseRestriction] = useState("");
  const [carManufacturer, setCarManufacturer] = useState("");
  const [modelYear, setModelYear] = useState("");
  const [carImage, setCarImage] = useState("");
  const [carImageName, setCarImageName] = useState("");

  const optionsMenuCarTypeCategory = [
    { value: '01', label: '경형/소형' },
    { value: '02', label: '중형/대형' },
    { value: '03', label: 'SUV' },
    { value: '04', label: '승합' },
  ];

  const optionsMenuOriginType = [
    { value: '01', label: '국산'},
    { value: '02', label: '수입'},
  ]

  const optionsMenuSeatingCapacity = [
    { value: '01', label: '4인승' },
    { value: '02', label: '5인승' },
    { value: '03', label: '6인승' },
    { value: '04', label: '7인승' },
    { value: '01', label: '8인승' },
    { value: '02', label: '9인승' },
    { value: '03', label: '10인승' },
    { value: '04', label: '11인승' },
    { value: '01', label: '12인승' },
    { value: '02', label: '15인승' },
  ];

  const optionsMenuFuelType = [
    { value: '01', label: '가솔린' },
    { value: '02', label: '디젤' },
    { value: '03', label: 'LPG' },
    { value: '04', label: '전기차' },
    { value: '05', label: '하이브리드' },
  ];

  const optionsMenuSpeedLimit = [
    { value: '01', label: '110km' },
    { value: '02', label: '180km' },
  ];

  const optionsMenuLicenseRestriction = [
    { value: '01', label: '2종보통' },
    { value: '02', label: '1종보통' },
  ];

  const optionsMenuCarManufacturer = [
    { value: '01', label: '기아자동차' },
    { value: '02', label: '현대자동차' },
    { value: '03', label: '제네시스' },
    { value: '04', label: '르노코리아' },
    { value: '05', label: 'KG모빌리티' },
    { value: '06', label: '쉐보레' },
    { value: '07', label: '테슬라' },
    { value: '08', label: '벤츠' },
    { value: '09', label: 'BMW' },
    { value: '10', label: 'Jeep' },
    { value: '11', label: 'MINI' },
    { value: '12', label: '아우디' },
    { value: '13', label: '포르쉐' },
    { value: '14', label: '폭스바겐' },
    { value: '15', label: '폴스타' },
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
      pageSize, // 화면에 보여줄 차종 개수(10개의 데이터 고정)
      pageNumber, // 현재 페이지 번호(기본 1페이지)
    };

    if (searchName && searchName.trim() !== '') {
      params.carTypeName = searchName; // 검색어가 있으면 params에 carTypeName도 같이 넣어서 서버에 요청함
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/cars/paged`, 
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });

    if (response.data) {
      setVehicles(response.data);
      console.log(vehicles);
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
    const params = searchName ? { carTypeName: searchName } : {};

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/cars/count`,
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

  useEffect(() => {
    pageingVehicles();
    getTotalCount();
  }, [pageNumber]); // pageNumber가 변경될때면 pageingVehicles(), getTotalCount() 함수 호출

  const handleUpdateClick = (updateData, workMode) => {
    setIsPopUp(true);
    setWorkMode(workMode);
    setCarTypeCode(updateData.car_type_code);
    setCarTypeCategory(updateData.car_type_category_code); // String타입으로 가져온(GET) 데이터를 다시 Char(2)타입으로 서버에 보내기위해 DB에서 전달(GET) 받은 code 이용
    setOriginType(updateData.origin_type_code); // String타입으로 가져온(GET) 데이터를 다시 Char(2)타입으로 서버에 보내기위해 DB에서 전달(GET) 받은 code 이용
    setCarTypeName(updateData.car_type_name);
    setSeatingCapacity(updateData.seating_capacity_code); // String타입으로 가져온(GET) 데이터를 다시 Char(2)타입으로 서버에 보내기위해 DB에서 전달(GET) 받은 code 이용
    setFuelType(updateData.fuel_type_code); // String타입으로 가져온(GET) 데이터를 다시 Char(2)타입으로 서버에 보내기위해 DB에서 전달(GET) 받은 code 이용
    setSpeedLimit(updateData.speed_limit_code); // String타입으로 가져온(GET) 데이터를 다시 Char(2)타입으로 서버에 보내기위해 DB에서 전달(GET) 받은 code 이용
    setLicenseRestriction(updateData.license_restriction_code); // String타입으로 가져온(GET) 데이터를 다시 Char(2)타입으로 서버에 보내기위해 DB에서 전달(GET) 받은 code 이용
    setCarManufacturer(updateData.car_manufacturer_code) // String타입으로 가져온(GET) 데이터를 다시 Char(2)타입으로 서버에 보내기위해 DB에서 전달(GET) 받은 code 이용
    setModelYear(updateData.model_year)
    setCarImage(`${process.env.REACT_APP_IMAGE_URL}/${updateData.car_image_name}`)
    setCarImageName(updateData.car_image_name)
  };

  const viewDataInit = () => {
    setCarTypeCode("");
    setCarTypeCategory("01");
    setOriginType("01");
    setCarTypeName("");
    setSeatingCapacity("01");
    setFuelType("01");
    setSpeedLimit("01");
    setLicenseRestriction("01");
    setCarManufacturer("01");
    setModelYear("")
    setCarImage("");
    setCarImageName("");
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

  const handleDeleteClick = async (carTypeCode) => {
    if (window.confirm('차종을 정말로 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('accessToken');
        await deleteVehicle(token, carTypeCode);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await deleteVehicle(newToken, carTypeCode);
          } catch (error) {
            alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
            handleAdminLogout();
          }
        } else {
          alert("차종 삭제 중 오류가 발생했습니다." + error);
        }
      }
    }
  };

  const deleteVehicle = async (token, carTypeCode) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/arentcar/manager/cars/${carTypeCode}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true,
    });
    setVehicles((prevVehicle) => prevVehicle.filter(vehicle => vehicle.car_type_code !== carTypeCode));
    alert("차종이 삭제되었습니다.");
  };

  const handleDataSaveClick = async () => {
    if (!validateCheck()) {
      return; 
    }

    const newVehicle = {
      car_type_code: carTypeCode,
      car_type_category: carTypeCategory,
      origin_type: originType,
      car_type_name: carTypeName,
      seating_capacity: seatingCapacity,
      fuel_type: fuelType,
      speed_limit: speedLimit,
      license_restriction: licenseRestriction,
      car_manufacturer: carManufacturer,
      model_year: modelYear,
    };

    const newVehicleImage = {
      car_image: carImage,
    };

    if (workMode === "수정") {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        await updateVehicle(token, newVehicle, newVehicleImage);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await updateVehicle(newToken, newVehicle, newVehicleImage);
          } catch (error) {
            alert("인증이 만료되었습니다. 다시 로그인 해주세요." + error);
            handleAdminLogout();
          }
        } else {
          alert("차종 수정 중 오류가 발생했습니다." + error);
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        await createVehicle(token, newVehicle, newVehicleImage);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await createVehicle(newToken, newVehicle, newVehicleImage);
          } catch (error) {
            alert("인증이 만료되었습니다. 다시 로그인 해주세요." + error);
            handleAdminLogout();
          }
        } else {
          alert("차종 등록 중 오류가 발생했습니다." + error);
        }
      } finally {
        setLoading(false);
      }
    }

    setIsPopUp(false);
  };

  const updateVehicle = async (token, newVehicle, newVehicleImage) => {
    try {
      if (!newVehicleImage || !newVehicleImage.car_image) {
        console.error("No image data available");
        return;
      }
  
      // Base64 문자열을 Blob으로 변환
      const byteString = atob(newVehicleImage.car_image.split(',')[1]);
      const mimeString = newVehicleImage.car_image.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      
      // FormData 객체 생성
      const formData = new FormData();
      formData.append('file', blob, carImageName);
      formData.append('carData', JSON.stringify(newVehicle));

      await axios.put(
        `${process.env.REACT_APP_API_URL}/arentcar/manager/cars/${carTypeCode}`,
        formData,
        {
          headers: {
            'Content-type': 'multipart/form-data', // 명시적으로 설정하지 않아도 axios가 객체를 전송할 때 자동으로 적절한 타입을 설정해줌
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setVehicles((prevVehicle) => prevVehicle.map(vehicle => vehicle.car_type_code === carTypeCode ? newVehicle : vehicle));
      alert("차종이 수정되었습니다.");
    } catch(error) {
      console.error("Error updating vehicle:", error);
      alert("차종 수정 중 오류가 발생했습니다.");
    }

  };

  const createVehicle = async (token, newVehicle, newVehicleImage) => {
    try {
      if (!newVehicleImage || !newVehicleImage.car_image) {
        console.error("No image data available");
        return;
      }
  
      // Base64(데이터URL) 문자열을 Blob으로 변환 - newVehicleImage.car_images는 Base64로 인코딩된 이미지 데이터 URL임
      const byteString = atob(newVehicleImage.car_image.split(',')[1]); // atob 함수를 이용해 Base64로 인코딩된(데이터URL) 문자열을 원래의 바이너리 데이터로 디코딩함, 데이터URL로 변환된 파일이 아니면 파일의 바이너리 데이터에 접근하기 어려움
      // -> 데이터 URL은 data:[<MIME-type>];[base64],<data> 형식이므로, ,를 기준으로 나누면 두 번째 요소가 Base64 데이터가 됨
      const mimeString = newVehicleImage.car_image.split(',')[0].split(':')[1].split(';')[0]; // URL(newVehicleImage.car_image)에서 MIME 타입을 추출함, MIME 타입은 파일의 형식과 내용을 설명하는 문자열임
      const ab = new ArrayBuffer(byteString.length); // JavaScript에서 바이너리 데이터를 저장하기 위한 버퍼(데이터를 일시적으로 저장하는 고정된 메모리 공간), 데이터를 저장함, 메모리 공간만 할당함
      const ia = new Uint8Array(ab); // 저장된 데이터를 특정 형식으로 읽고 쓰기위해 사용하는 TypedArray객체(Uint8Array, Int16Array, Float32Array 등...)
      // -> Uint8Array는 데이터를 8비트 부호 없는 정수 배열로 해석함, 각 요소는 0에서 255 사이의 값을 가집니다
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString }); // Blob 객체를 생성하여 바이너리 데이터를 파일 형식으로 변환함. Blob은 파일과 유사한 객체, 서버에 전송 가능함
      
      // FormData 객체 생성
      const formData = new FormData(); // 파일과 데이터를 함께 전송할 수 있도록 준비, key와 value로 구성됨
      formData.append('file', blob, carImageName); // blob형태로 파일(이미지) 저장, 파일(이미지)의 이름(carImageName)도 함께 저장
      formData.append('carData', JSON.stringify(newVehicle)); // JSON형태로 데이타 저장

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/arentcar/manager/cars`, 
        formData,
        {
          headers: {
            'Content-type': 'multipart/form-data', // 명시적으로 설정하지 않아도 axios가 객체를 전송할 때 자동으로 적절한 타입을 설정해줌
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });

        const savedVehicle = response.data;
        newVehicle.car_type_code = response.data.car_type_code;
        newVehicle.car_type_password = response.data.car_type_password;
        setVehicles((prevVehicle) => [...prevVehicle, savedVehicle]);
        alert("차종이 등록되었습니다.");
    } catch (error) {
      console.error("Error creating vehicle:", error);
      alert("차종 등록 중 오류가 발생했습니다.");
    }
  };

  const handleImageUpload = (e) => {
    const {files} = e.target;
    if (files && files.length > 0) { // 하나 이상의 파일이 선택되었는지 확인
      const uploadFile = files[0]; // 선택한 첫 번째 파일을 변수에 저장
      const fileName = uploadFile.name; // 원본 파일 이름 가져오기

      const reader = new FileReader(); // 파일을 읽고 그 내용을 다양한 형식으로 변활할 수 있는 API를 제공
      reader.readAsDataURL(uploadFile); // 데이터를 URL로변환. 데이터 URL은 파일의 내용을 Base64로 인코딩한 문자열임, URL로 변환 안 하면 이미지 미리보기 불가능(<img> 태그의 src 속성에 설정할 수 있는 데이터가 없음)
      reader.onloadend = () => { // 파일 읽기가 완료되면 호출되는 콜백 함수.
        setCarImage(reader.result); // 파일의 결과(URL 포함)를 carImage에 저장, 이미지 미리보기에 이용 가능
      };

       // 원본 파일 이름을 다른 곳에서 사용하고 싶다면 상태로 저장할 수도 있습니다.
       setCarImageName(fileName);
    } else {
       // 파일 선택이 취소된 경우 상태 초기화
       setCarImage(null); // 이미지 데이터 초기화
       setCarImageName(''); 
    }
  }

  const handlePopupCloseClick = () => {
    setIsPopUp(false);
  };

  const handleCloseClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const validateCheck = () => {
    if (!carTypeName || carTypeName.trim() === '') {
      alert("차종명을 입력해주세요.");
      return false;
    };
    if (!modelYear || modelYear.trim() === '') {
      alert("년식을 입력해주세요.");
      return false;
    };
    if (!carImage || carImage.trim() === '') {
      alert("차종이미지를 등록해주세요.");
      return false;
    };
  
    return true; 
  };

  const totalWidth = columnDefs.reduce((sum, columnDef) => {
    return sum + (columnDef.width ? columnDef.width : 150);
  }, 0);

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber); // 변경된 현재 페이지 번호(-1씩 또는 +1씩 가감)
  };

  let totalPages = Math.ceil(totalCount / pageSize); // 총 페이지 수 = 올림(전체 차종 수 / 화면에 보여줄 데이터 수(현재 페이지에서는 10개씩 보여줌))
  if (totalPages < 1) {
    totalPages = 1;
  }

  return (
    <div className="car-info-wrap">
      <div className="car-info-header-wrap">
        <div className="car-info-title-wrap">
          <div className="manager-title">● 차종관리</div>
        </div>
        <div
          className='car-info-button-wrap'
          style={{ width: `${totalWidth}px` }}
        >
          <div className='flex-align-center'>
            <label className='manager-label' htmlFor="">차종명</label>
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
                      <button className='manager-button manager-button-delete' onClick={() => handleDeleteClick(row.car_type_code)}>삭제</button>
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
                <div className='manager-popup-title'>● 차종{workMode}</div>
                <div className='car-info-content-popup-button'>
                  <button className='manager-button manager-button-save' onClick={handleDataSaveClick}>저장</button>
                  <button className='manager-button manager-button-close' onClick={handlePopupCloseClick}>닫기</button>
                </div>
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="carTypeCode">차종코드</label>
                <input className='width50  word-center' id='carTypeCode' type="text" value={carTypeCode} disabled />
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="carTypeCategory">차종구분</label>
                <select className='width100' id="carTypeCategory" value={carTypeCategory} onChange={(e) => (setCarTypeCategory(e.target.value))}>
                  {optionsMenuCarTypeCategory.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="originType">국산/수입</label>
                <select className='width100' id="originType" value={originType} onChange={(e) => (setOriginType(e.target.value))}>
                  {optionsMenuOriginType.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="carTypeName">차종명</label>
                <input className='width100 word-center' id='carTypeName' type="text" placeholder="모닝" maxLength={6} value={carTypeName} onChange={(e) => setCarTypeName(e.target.value)} />
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="seatingCapacity">수용인원</label>
                <select className='width100' id="seatingCapacity" value={seatingCapacity} onChange={(e) => (setSeatingCapacity(e.target.value))}>
                  {optionsMenuSeatingCapacity.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="fuelType">연료</label>
                <select className='width100' id="fuelType" value={fuelType} onChange={(e) => (setFuelType(e.target.value))}>
                  {optionsMenuFuelType.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="speedLimit">속도제한</label>
                <select className='width100' id="speedLimit" value={speedLimit} onChange={(e) => (setSpeedLimit(e.target.value))}>
                  {optionsMenuSpeedLimit.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="licenseRestriction">면허제한</label>
                <select className='width100' id="licenseRestriction" value={licenseRestriction} onChange={(e) => (setLicenseRestriction(e.target.value))}>
                  {optionsMenuLicenseRestriction.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="carManufacturer">제조사</label>
                <select className='width100' id="carManufacturer" value={carManufacturer} onChange={(e) => (setCarManufacturer(e.target.value))}>
                  {optionsMenuCarManufacturer.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="modelYear">년식</label>
                <input className='width100  word-center' id='modelYear' type="text" placeholder="2020년식" value={modelYear} onChange={(e) => {setModelYear(e.target.value)}} />
              </div>
              <div className='car-info-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="carImage">차량이미지</label>
                <input className='car-info-file-button' id='carImage' name="file" type="file" accept="image/*" onChange={handleImageUpload} />
                {carImage && <img className="width350" src={carImage} alt="Selected Car" />}
                {/* <img className="width350" src = {carImage} alt={carImage}  /> */}
                {carImageName && <p className='word-center'>파일 이름 : {carImageName}</p>}
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
        <div className='car-info-pageing-display'>{pageNumber} / {totalPages}</div> {/* 현재 페이지 / 전체 페이지 */}
        <button 
          className='manager-button' 
          style={{color: pageNumber === totalPages ?  '#aaa' : 'rgb(38, 49, 155)'}} 
          onClick={() => handlePageChange(pageNumber + 1)} 
          disabled={pageNumber === totalPages}
        >다음</button>
      </div>

      {loading && (<Loading />)}
    </div>
  );
};

export default CarInfo;
