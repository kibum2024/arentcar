import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAdminState } from '../../redux/AdminState';
import axios from 'axios';
import api from 'common/api';
import Cookies from 'js-cookie';
import { refreshAccessToken, handleAdminLogout } from 'common/Common';
import 'manager/system/ManagerLogin.css';


const ManagerLogin = () => {
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isInputPassword, setIsInputPassword] = useState(false);
  const [idSaveChk, setIdSaveChk] = useState(false);
  const dispatch = useDispatch();
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    setAdminId(localStorage.getItem('saveId'));
    const idSaveChkValue = localStorage.getItem('idSaveChk') === "1" ? true : false;
    if (idSaveChkValue) {
      setIdSaveChk(idSaveChkValue);
    }
  }, []);

  const handleIdSaveChkChange = (e) => {
    const idSaveChkValue = e.target.checked;
    setIdSaveChk(idSaveChkValue);
    if (idSaveChkValue) {
      localStorage.setItem('idSaveChk', idSaveChkValue ? "1" : "2"); 
      localStorage.setItem('saveId', adminId); 
    } else {  
     localStorage.removeItem('idSaveChk');
     localStorage.removeItem('saveId');
    };
  };

  const handleLoginClick = async () => {
    try {
      localStorage.removeItem('accessToken');
      Cookies.remove('refreshToken'); 

      localStorage.removeItem('accessToken');
      Cookies.remove('refreshToken'); 
      
      delete axios.defaults.headers.common['Authorization'];
      // console.log("토큰이 삭제되었습니다.");

      const response = await api.post(`${process.env.REACT_APP_API_URL}/arentcar/manager/admins/login`, {
        admin_id: adminId,
        admin_password: adminPassword,
      });
  
      if (response.data.admins.usage_status === "3") {
        setIsInputPassword(true);
        return;
      }
      // 액세스 토큰 저장
      api.setAccessToken(response.data.token);
  
      // 서버 응답 구조에 맞게 수정
      const adminData = response.data.admins;
      dispatch(setAdminState({
        adminCode: adminData.admin_code,
        adminName: adminData.admin_name,
        adminEmail: adminData.admin_email,
        adminRole: adminData.admin_role,
        loginState: true,
      }));
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 404) {
        alert("아이디와 비밀번호를 확인 후 다시 로그인바랍니다.");
      } else {
        alert("로그인 중 오류가 발생하였습니다. " + error.message);
      }  
    }
  };

  const handleNewPasswordClick = async () => {
    if (!validateCheck()) {
      return; 
    }

    try {
      const token = localStorage.getItem('accessToken');
      await updatePassword(token);
      alert("새로운 비밀번호로 변경되었습니다. 로그인바랍니다.");
      setIsInputPassword(false);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await updatePassword(newToken);
        } catch (refreshError) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleAdminLogout();
        }
      } else {
      alert("비밀번호 변경  중 오류가 발생하였습니다. " + error.message);
      }
    }
  }

  const updatePassword = async (token) => {
    await api.put(
      `${process.env.REACT_APP_API_URL}/arentcar/manager/admins/newpassword`,
      {
        admin_id: adminId,
        admin_password: newPassword,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
  };

  const validateCheck = () => {
    if (!passwordRegex.test(newPassword)) {
      alert("최소 하나의 알파벳, 숫자, 특수문자와 8자 이상으로 입력해주세요.");
      return false;
    };
    if (newPassword !== confirmPassword) {
      alert("두개의 비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
      return false;
    };
    return true; 
  };

  return (
    <div className="manager-login-wrap">
      <div className='manager-login-title-wrap'>
        <img className="manager-login-title-img" src={`${process.env.REACT_APP_IMAGE_URL}/arentcar.png`} alt="" />
        <div className="manager-login-title-name">관리자시스템</div>
      </div>
      <div className="manager-login-box-wrap">
        <div className="manager-login-box">
          <div className="manager-login-area">
            <input type="text" id="userId" maxlength="50" placeholder="아이디를 입력해 주세요." title="입력태그" value={adminId} onChange={(e) => { setAdminId(e.target.value) }} />
            <input type="password" id="userPassword" maxlength="50" placeholder="비밀번호를 입력해 주세요." title="입력태그" value={adminPassword} onChange={(e) => { setAdminPassword(e.target.value) }} />
            <button type="button" className="manager-login-button" onClick={handleLoginClick}>로그인</button>
          </div>
          <div className="manager-login-bot-wrap">
            <input type="checkbox" name="loginCheck" id="checkSavedID" checked={idSaveChk} onChange={handleIdSaveChkChange}/>
            <label for="checkSavedID">아이디 저장</label>
          </div>
        </div>
      </div>
      {isInputPassword && 
        <div className='manager-popup'>
          <div className='manager-login-new-password-wrap'>
            <div className='manager-login-new-password-title'>임시 비밀번호 변경</div>
            <div className='manager-login-new-password-line'>
              <label className='width100 word-right label-margin-right' htmlFor="newPassword">새로운 비밀번호</label>
              <input className='width300' type="password" id="newPassword" maxlength="50" placeholder="새로운 비밀번호를 입력해 주세요." title="입력태그" value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }} />
            </div>
            <div className='manager-login-new-password-line'>
              <label className='width100 word-right label-margin-right' htmlFor="newPassword">확인 비밀번호</label>
              <input className='width300' type="password" id="confirmPassword" maxlength="50" placeholder="확인 비밀번호를 입력해 주세요." title="입력태그" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
            </div>
            <div className='manager-login-new-password-line align-right'>
              <button type="button" className="manager-button manager-button-save" onClick={handleNewPasswordClick}>확인</button>
              <button type="button" className="manager-button manager-button-close" onClick={() => setIsInputPassword(false)}>닫기</button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default ManagerLogin;