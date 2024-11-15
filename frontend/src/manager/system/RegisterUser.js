import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'manager/system/RegisterUser.css';

const RegisterUser = ({ onClick }) => {
  const [admins, setAdmins] = useState([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const [workMode, setWorkMode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);

  const [columnDefs] = useState([
    { headerName: '코드', field: 'admin_code', width: 80, align: 'center' },
    { headerName: '관리자ID', field: 'admin_id', width: 150, align: 'left' },
    { headerName: '관리자명', field: 'admin_name', width: 200, align: 'left' },
    { headerName: '비밀번호', field: 'admin_password', width: 200, align: 'left' },
    { headerName: '이메일', field: 'admin_email', width: 150, align: 'left' },
    { headerName: '권한', field: 'admin_role', width: 50, align: 'center' },
    { headerName: '사용여부', field: 'usage_status', width: 80, align: 'center' },
    { headerName: '작업', field: '', width: 200, align: 'center' },
  ]);

  const [adminCode, setAdminCode] = useState("");
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [usageStatus, setUsageStatus] = useState("");

  const optionsAdminRole = [
    { value: '1', label: '시스템관리자' },
    { value: '2', label: '사용자관리자' },
  ];

  const optionsUsageStatus = [
    { value: '1', label: '사용' },
    { value: '2', label: '미사용' },
    { value: '3', label: '최초접속' },
  ];

  const pageingAdmins = async () => {
    try {
      const params = {
        pageSize,
        pageNumber,
      };
  
      if (searchName && searchName.trim() !== '') {
        params.menuName = searchName;
      }
  
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/admins/paged`, { params });
      if (response.data) {
        setAdmins(response.data);
      }
    } catch (error) {
      console.error('There was an error fetching the admins pageing!', error);
    }
  };

  const getTotalCount = async () => {
    try {

      const params = searchName ? { menuName: searchName } : {};
  
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/admins/count`, { params });
      if (typeof response.data === 'number') {
        setTotalCount(response.data);
      } else {
        console.error('Unexpected response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching total admins count', error);
    }
  };

  useEffect(() => {
    pageingAdmins();
    getTotalCount();
  }, [pageNumber, pageSize]);

  const handleUpdateClick = (findCode, workMode) => {
    setIsPopUp(true);
    setWorkMode(workMode);
    setAdminCode(findCode.admin_code);
    setAdminId(findCode.admin_id);
    setAdminPassword(findCode.admin_password);
    setAdminName(findCode.admin_name);
    setAdminRole(findCode.admin_role);
    setAdminEmail(findCode.admin_email);
    setUsageStatus(findCode.usage_status);
  };

  const viewDataInit = () => {
    setAdminCode("");
    setAdminId("");
    setAdminPassword("");
    setAdminName("");
    setAdminRole("2");
    setAdminEmail("");
    setUsageStatus("3");
  };

  const handleSearchClick = async () => {
    pageingAdmins();
    getTotalCount();
  };

  const handleInsertClick = (workMode) => {
    setIsPopUp(true);
    setWorkMode(workMode);
    viewDataInit();
  };

  const handleDeleteClick = async (adminCode) => {
    if (window.confirm('자료를 정말로 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/arentcar/manager/admins/${adminCode}`);
        setAdmins((prevAdmin) => prevAdmin.filter(admin => admin.admin_code !== adminCode));
        alert("자료가 삭제되었습니다.");
      } catch (error) {
        alert("삭제 중 오류가 발생했습니다." + error);
      }
    }
  };

  const handleDataSaveClick = async () => {
    let newAdmin = {
      admin_code: adminCode,
      admin_id: adminId,
      admin_password: adminPassword,
      admin_name: adminName, 
      admin_role: adminRole,
      admin_email: adminEmail,
      usage_status: usageStatus,
    };

    if (workMode === "수정") {
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/arentcar/manager/admins/${adminCode}`, newAdmin);
        setAdmins((prevAdmin) => prevAdmin.map(admin => admin.admin_code === adminCode ? newAdmin : admin));
        alert("자료가 수정되었습니다.");
      } catch (error) {
        alert("수정 중 오류가 발생했습니다." + error);
      }
    } else {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/arentcar/manager/admins`, newAdmin);
        newAdmin.admin_code = response.data.admin_code;
        setAdmins((prevAdmin) => [...prevAdmin, newAdmin]);
        alert("자료가 등록되었습니다.");
      } catch (error) {
        alert("등록 중 오류가 발생했습니다." + error);
      }
    }

    setIsPopUp(false);
  };

  const handlePopupClodeClick = () => {
    setIsPopUp(false);
  };

  const handleCloseClick = () => {
    if (onClick) {
      onClick();
    }
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
    <div className='register-menu-wrap'>
      <div className='register-menu-header-wrap'>
        <div className='register-menu-title-wrap'>
          <div className='manager-title'>● 관리자등록</div>
        </div>
        <div
          className='register-menu-button-wrap'
          style={{ width: `${totalWidth}px` }}
        >
          <div className='flex-align-center'>
            <label className='manager-label' htmlFor="">관리자명</label>
            <input className='width200' type="text" value={searchName} onChange={(e) => (setSearchName(e.target.value))}/>
            <button className='manager-button manager-button-search' onClick={() => handleSearchClick()}>검색</button>
            <span>[검색건수 : {totalCount}건]</span>
          </div>
          <div>
            <button className='manager-button manager-button-insert' onClick={() => handleInsertClick("등록")}>추가</button>
            <button className='manager-button manager-button-close' onClick={() => handleCloseClick()}>닫기</button>
          </div>
        </div>
      </div>
      <div className='register-menu-content-wrap'>
        <div className='register-menu-content-header'>
          {columnDefs.map((title, index) => (
            <div key={index} className='manager-head-column' style={{ width: `${title.width}px`, textAlign: `center` }}>{title.headerName}</div>
          ))}
        </div>
        <div className='register-menu-content-row-wrap'>
          {admins.map((row, index) => (
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
                      <button className='manager-button manager-button-delete' onClick={() => handleDeleteClick(row.admin_code)}>삭제</button>
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
            <div className='register-menu-content-popup-wrap'>
              <div className='register-menu-content-popup-close'>
                <div className='manager-popup-title'>● 관리자{workMode}</div>
                <div className='register-menu-content-popup-button'>
                  <button className='manager-button manager-button-save' onClick={handleDataSaveClick}>저장</button>
                  <button className='manager-button manager-button-close' onClick={handlePopupClodeClick}>닫기</button>
                </div>
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">관리자코드</label>
                <input className='width50  word-center' type="text" value={adminCode} disabled />
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">관리자ID</label>
                <input className='width300 word-left' value={adminId} type="text" maxLength={30} onChange={(e) => setAdminId(e.target.value)} />
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">관리자명</label>
                <input className='width300 word-left' value={adminName} type="text" maxLength={30} onChange={(e) => setAdminName(e.target.value)} />
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">비밀번호</label>
                <input className='width300 word-center' value={adminPassword} type="text" maxLength={50} onChange={(e) => setAdminPassword(e.target.value)} />
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">이메일</label>
                <input className='width300' type="text" value={adminEmail} maxLength={50} onChange={(e) => setAdminEmail(e.target.value)} />
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">사용권한</label>
                <select className='width150' id="comboBox" value={adminRole} onChange={(e) => (setAdminRole(e.target.value))}>
                  {optionsAdminRole.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">사용여부</label>
                <select className='width150' id="comboBox" value={usageStatus} onChange={(e) => (setUsageStatus(e.target.value))}>
                  {optionsUsageStatus.map((option) => (
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
      <div className='register-menu-pageing-wrap flex-align-center'>
        <button 
          className='manager-button'
          style={{color: pageNumber === 1 ?  '#aaa' : 'rgb(38, 49, 155)'}} 
          onClick={() => handlePageChange(pageNumber - 1)} 
          disabled={pageNumber === 1}
        >이전</button>
        <div className='register-menu-pageing-display'>{pageNumber} / {totalPages}</div>
        <button 
          className='manager-button' 
          style={{color: pageNumber === totalPages ?  '#aaa' : 'rgb(38, 49, 155)'}} 
          onClick={() => handlePageChange(pageNumber + 1)} 
          disabled={pageNumber === totalPages}
        >다음</button>
      </div>
    </div>
  );
}

export default RegisterUser;
