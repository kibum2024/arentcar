import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { refreshAccessToken, handleLogout, formatDate, formatPhone } from 'common/Common';
import Loading from 'common/Loading';
import 'manager/system/ManagerUser.css';

const ManagerUser = ({ onClick }) => {
  const [users, setUsers] = useState([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [workMode, setWorkMode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [totalCount, setTotalCount] = useState(0);

  const [columnDefs] = useState([
    { headerName: '코드', field: 'user_code', width: 50, align: 'center' },
    { headerName: '사용자명', field: 'user_name', width: 150, align: 'left' },
    { headerName: '이메일', field: 'user_email', width: 150, align: 'left' },
    { headerName: '휴대폰번호', field: 'user_phone_number', width: 120, align: 'center' },
    { headerName: '생년월일', field: 'user_birth_date', width: 100, align: 'center' },
    { headerName: '사용자구분', field: 'user_category', width: 120, align: 'center' },
    { headerName: '사용여부', field: 'usage_status', width: 80, align: 'center' },
    { headerName: '작업', field: '', width: 200, align: 'center' },
  ]);

  const [userCode, setUserCode] = useState("");
  const [userId, setUserId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [userBirthDate, setUserBirthDate] = useState("");
  const [userCategory, setUserCategory] = useState("");
  const [usageStatus, setUsageStatus] = useState("");

  const optionsUserCategory = [
    { value: '1', label: '일반' },
    { value: '2', label: 'VIP' },
    { value: '3', label: 'VVIP' },
  ];

  const optionsUsageStatus = [
    { value: '1', label: '사용' },
    { value: '2', label: '정지' },
  ];

  const pageingUsers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await getUsers(token);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getUsers(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the users pageing!', error);
      }
    }
  };

  const getUsers = async (token) => {
    const params = {
      pageSize,
      pageNumber,
    };

    if (searchName && searchName.trim() !== '') {
      params.menuName = searchName;
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/user/users/paged`, 
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });

    if (response.data) {
      setUsers(response.data);
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
        console.error('There was an error fetching the users count!', error);
      }
    }
  };

  const getCount = async (token) => {
    const params = searchName ? { menuName: searchName } : {};

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/user/users/count`,
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
    pageingUsers();
    getTotalCount();
  }, [pageNumber, pageSize]);

  const handleUpdateClick = (findCode, workMode) => {
    setIsPopUp(true);
    setWorkMode(workMode);
    setUserCode(findCode.user_code);
    setUserName(findCode.user_name);
    setUserPassword(findCode.user_password);
    setUserEmail(findCode.user_email);
    setUserPhoneNumber(findCode.user_phone_number);
    setUserBirthDate(findCode.user_birth_date);
    setUserCategory(findCode.user_category);
    setUsageStatus(findCode.usage_status);
  };

  const viewDataInit = () => {
    setUserCode("");
    setUserId("");
    setUserPassword("");
    setUserName("");
    setUserEmail("");
    setUserPhoneNumber("");
    setUserBirthDate("");
    setUserCategory("1");
    setUsageStatus("3");
  };

  const handleSearchClick = async () => {
    pageingUsers();
    getTotalCount();
  };

  const handleInsertClick = (workMode) => {
    setIsPopUp(true);
    setWorkMode(workMode);
    viewDataInit();
  };

  const handleDeleteClick = async (userCode) => {
    if (window.confirm('자료를 정말로 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('accessToken');
        await deleteUser(token, userCode);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await deleteUser(newToken, userCode);
          } catch (error) {
            alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
            handleLogout();
          }
        } else if (error.response.status === 409) {
            alert("예약, 리뷰 등의 정보가 존재하여 삭제할 수 없습니다.");
        } else {
          alert("삭제 중 오류가 발생했습니다.");
        }
      }
    }
  };

  const deleteUser = async (token, userCode) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/arentcar/user/users/${userCode}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true,
    });
    setUsers((prevUser) => prevUser.filter(user => user.user_code !== userCode));
    alert("자료가 삭제되었습니다.");
  };

  const handleDataSaveClick = async () => {
    if (!validateCheck()) {
      return;
    }

    let newUser = {
      user_code: userCode,
      user_id: userId,
      user_password: userPassword,
      user_name: userName,
      user_email: userEmail,
      user_phone_number: userPhoneNumber,
      user_birth_date: userBirthDate,
      user_category: userCategory,
      usage_status: usageStatus,
    };

    if (workMode === "수정") {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        await updateUser(token, newUser);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await updateUser(newToken, newUser);
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
        await createUser(token, newUser);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await createUser(newToken, newUser);
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

  const updateUser = async (token, newUser) => {
    await axios.put(`${process.env.REACT_APP_API_URL}/arentcar/user/users/${userCode}`,
      newUser,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    setUsers((prevUser) => prevUser.map(user => user.user_code === userCode ? newUser : user));
    alert("자료가 수정되었습니다.");
  };

  const createUser = async (token, newUser) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/arentcar/user/users`, 
      newUser,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });
    newUser.user_code = response.data.user_code;
    newUser.user_password = response.data.user_password;
    setUsers((prevUser) => [...prevUser, newUser]);
    alert("자료가 등록되었습니다.");
  };

  const handlePopupClodeClick = () => {
    setIsPopUp(false);
  };

  const handleCloseClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const validateCheck = () => {
    if (!userName || userName.trim() === '') {
      alert("관리자명을 입력해주세요.");
      return false;
    };
    if (!emailRegex.test(userEmail)) {
      alert("유효하지 않은 이메일 주소입니다.");
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
    <div className='manager-user-wrap'>
      <div className='manager-user-header-wrap'>
        <div className='manager-user-title-wrap'>
          <div className='manager-title'>● 사용자관리</div>
        </div>
        <div
          className='manager-user-button-wrap'
          style={{ width: `${totalWidth}px` }}
        >
          <div className='flex-align-center'>
            <label className='manager-label' htmlFor="">사용자명</label>
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
      <div className='manager-user-content-wrap'>
        <div className='manager-user-content-header'>
          {columnDefs.map((title, index) => (
            <div key={index} className='manager-head-column' style={{ width: `${title.width}px`, textAlign: `center` }}>{title.headerName}</div>
          ))}
        </div>
        <div className='manager-user-content-row-wrap'>
          {users.map((row, index) => (
            <div key={index} className='manager-user-content-row'>
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
                      <button className='manager-button manager-button-delete' onClick={() => handleDeleteClick(row.user_code)}>삭제</button>
                    </>
                  ) : (
                    title.field === 'user_category' ? (
                      optionsUserCategory.find(option => option.value === row[title.field])?.label || row[title.field]
                    ) :
                    title.field === 'usage_status' ? (
                      optionsUsageStatus.find(option => option.value === row[title.field])?.label || row[title.field]
                    ) :
                    title.field === 'user_phone_number' ? (
                      formatPhone(row[title.field])
                    ) :
                    title.field === 'user_birth_date' ? (
                      formatDate(row[title.field])
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
            <div className='manager-user-content-popup-wrap'>
              <div className='manager-user-content-popup-close'>
                <div className='manager-popup-title'>● 사용자{workMode}</div>
                <div className='manager-user-content-popup-button'>
                  <button className='manager-button manager-button-save' onClick={handleDataSaveClick}>저장</button>
                  <button className='manager-button manager-button-close' onClick={handlePopupClodeClick}>닫기</button>
                </div>
              </div>
              <div className='manager-user-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">사용자코드</label>
                <input className='width50  word-center' type="text" value={userCode} disabled />
              </div>
              <div className='manager-user-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">이메일</label>
                <input className='width300' type="text" value={userEmail} maxLength={50} onChange={(e) => setUserEmail(e.target.value)} />
              </div>
              <div className='manager-user-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">사용자명</label>
                <input className='width300 word-left' value={userName} type="text" maxLength={30} onChange={(e) => setUserName(e.target.value)} />
              </div>
              <div className='manager-user-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">생년월일</label>
                <input className='width300 word-left' value={userBirthDate} type="text" maxLength={8} onChange={(e) => setUserBirthDate(e.target.value)} />
              </div>
              <div className='manager-user-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">휴대폰번호</label>
                <input className='width300 word-left' value={userPhoneNumber} type="text" maxLength={11} onChange={(e) => setUserPhoneNumber(e.target.value)} />
              </div>
              <div className='manager-user-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">사용구분</label>
                <select className='width150' id="comboBox" value={userCategory} onChange={(e) => (setUserCategory(e.target.value))}>
                  {optionsUserCategory.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='manager-user-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">사용여부</label>
                <select className='manager-user-content-popup-usage-status width150' id="comboBox" value={usageStatus} onChange={(e) => (setUsageStatus(e.target.value))}>
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
      <div className='manager-user-pageing-wrap flex-align-center'>
        <button
          className='manager-button'
          style={{ color: pageNumber === 1 ? '#aaa' : 'rgb(38, 49, 155)' }}
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
        >이전</button>
        <div className='manager-user-pageing-display'>{pageNumber} / {totalPages}</div>
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

export default ManagerUser;
