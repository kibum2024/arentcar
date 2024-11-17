import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { refreshAccessToken, handleLogout } from 'common/Common';
import Loading from 'common/Loading';
import 'manager/system/RegisterUser.css';

const RegisterUser = ({ onClick }) => {
  const [admins, setAdmins] = useState([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [workMode, setWorkMode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const adminIdRegex = /^[a-zA-Z0-9]{8,15}$/;
  const [totalCount, setTotalCount] = useState(0);

  const [columnDefs] = useState([
    { headerName: '코드', field: 'admin_code', width: 50, align: 'center' },
    { headerName: '관리자ID', field: 'admin_id', width: 150, align: 'left' },
    { headerName: '관리자명', field: 'admin_name', width: 200, align: 'left' },
    { headerName: '비밀번호', field: 'admin_password', width: 200, align: 'left' },
    { headerName: '이메일', field: 'admin_email', width: 150, align: 'left' },
    { headerName: '권한', field: 'admin_role', width: 100, align: 'center' },
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
      const token = localStorage.getItem('accessToken');
      await getAdmins(token);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getAdmins(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the admins pageing!', error);
      }
    }
  };

  const getAdmins = async (token) => {
    const params = {
      pageSize,
      pageNumber,
    };

    if (searchName && searchName.trim() !== '') {
      params.menuName = searchName;
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/admins/paged`, 
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });

    if (response.data) {
      setAdmins(response.data);
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
        console.error('There was an error fetching the admins count!', error);
      }
    }
  };

  const getCount = async (token) => {
    const params = searchName ? { menuName: searchName } : {};

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/admins/count`,
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
        const token = localStorage.getItem('accessToken');
        await deleteAdmin(token, adminCode);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await deleteAdmin(newToken, adminCode);
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

  const deleteAdmin = async (token, adminCode) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/arentcar/manager/admins/${adminCode}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true,
    });
    setAdmins((prevAdmin) => prevAdmin.filter(admin => admin.admin_code !== adminCode));
    alert("자료가 삭제되었습니다.");
  };

  const handleDataSaveClick = async () => {
    if (!validateCheck()) {
      return;
    }

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
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        await updateAdmin(token, newAdmin);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await updateAdmin(newToken, newAdmin);
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
        await createAdmin(token, newAdmin);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await createAdmin(newToken, newAdmin);
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

  const updateAdmin = async (token, newAdmin) => {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/arentcar/manager/admins/${adminCode}`,
      newAdmin,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    setAdmins((prevAdmin) => prevAdmin.map(admin => admin.admin_code === adminCode ? newAdmin : admin));
    alert("자료가 수정되었습니다.");
  };

  const createAdmin = async (token, newAdmin) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/arentcar/manager/admins`, 
      newAdmin,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });
    newAdmin.admin_code = response.data.admin_code;
    newAdmin.admin_password = response.data.admin_password;
    setAdmins((prevAdmin) => [...prevAdmin, newAdmin]);
    alert("자료가 등록되었습니다.");
  };

  const handlePopupClodeClick = () => {
    setIsPopUp(false);
  };

  const handleDataUseStopClick = () => {
    setUsageStatus("2");
  };

  const handlePasswordIssueClick = async () => {
    if (window.confirm('임시비밀번호를 발급하시겠습니까?')) {
      setUsageStatus("3");
      let newAdmin = {
        admin_code: adminCode,
        admin_id: adminId,
        admin_password: adminPassword,
        admin_name: adminName,
        admin_role: adminRole,
        admin_email: adminEmail,
        usage_status: "3",
      };
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        await updatePassword(token, newAdmin);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await updatePassword(newToken, newAdmin);
          } catch (error) {
            alert("인증이 만료되었습니다. 다시 로그인 해주세요." + error);
            handleLogout();
          }
        } else {
          alert("임시비밀번호 중 오류가 발생했습니다." + error);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const updatePassword = async (token, newAdmin) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/arentcar/manager/admins/issue/${adminCode}`,
      newAdmin,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, 
      }
    );
    newAdmin.usage_status = response.data.usage_status;
    newAdmin.admin_password = response.data.admin_password;
    setAdmins((prevAdmin) => prevAdmin.map(admin => admin.admin_code === adminCode ? newAdmin : admin));
    alert("임시비밀번호가 발급되었습니다.");
  };

  const handleCloseClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const validateCheck = () => {
    if (!adminId || adminId.trim() === '') {
      alert("관리자ID를 입력해주세요.");
      return false;
    };
    if (!adminName || adminName.trim() === '') {
      alert("관리자명을 입력해주세요.");
      return false;
    };
    if (!emailRegex.test(adminEmail)) {
      alert("유효하지 않은 이메일 주소입니다.");
      return false;
    };
    if (!adminIdRegex.test(adminId)) {
      alert("대소문영문자과 숫자로 8자 이상, 15자 이하로 입력해주세요.");
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
            <input className='width200' type="text" value={searchName} onChange={(e) => (setSearchName(e.target.value))} />
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
                    title.field === 'admin_role' ? (
                      optionsAdminRole.find(option => option.value === row[title.field])?.label || row[title.field]
                    ) :
                      title.field === 'usage_status' ? (
                        optionsUsageStatus.find(option => option.value === row[title.field])?.label || row[title.field]
                      ) :
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
                  {workMode === "수정" &&
                    <>
                      <button className='manager-button manager-button-issue' onClick={handlePasswordIssueClick}>임시발급</button>
                      <button className='manager-button manager-button-stop' onClick={handleDataUseStopClick}>사용정지</button>
                    </>
                  }
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
                <input className='width300 word-left' value={adminPassword} type="text" maxLength={50} disabled onChange={(e) => setAdminPassword(e.target.value)} />
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
                <select className='register-menu-content-popup-usage-status width150' id="comboBox" value={usageStatus} disabled onChange={(e) => (setUsageStatus(e.target.value))}>
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
          style={{ color: pageNumber === 1 ? '#aaa' : 'rgb(38, 49, 155)' }}
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
        >이전</button>
        <div className='register-menu-pageing-display'>{pageNumber} / {totalPages}</div>
        <button
          className='manager-button'
          style={{ color: pageNumber === totalPages ? '#aaa' : 'rgb(38, 49, 155)' }}
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber === totalPages}
        >다음</button>
      </div>
      {loading && (
        <Loading />
      )}
    </div>
  );
}

export default RegisterUser;
