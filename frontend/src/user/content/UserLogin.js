import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserState } from '../../redux/UserState';
import api from 'common/api';
import { refreshAccessToken, handleLogout } from 'common/Common';
import 'user/content/UserLogin.css';


const UserLogin = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isInputPassword, setIsInputPassword] = useState(false);
  const [idSaveChk, setIdSaveChk] = useState(false);
  const dispatch = useDispatch();
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    setUserEmail(localStorage.getItem('saveUserEmail'));
    const idSaveChkValue = localStorage.getItem('UserIdSaveChk') === "1" ? true : false;
    if (idSaveChkValue) {
      setIdSaveChk(idSaveChkValue);
    }
  }, []);

  const handleIdSaveChkChange = (e) => {
    const idSaveChkValue = e.target.checked;
    setIdSaveChk(idSaveChkValue);
    if (idSaveChkValue) {
      localStorage.setItem('UserIdSaveChk', idSaveChkValue ? "1" : "2");
      localStorage.setItem('saveUserEmail', userEmail);
    } else {
      localStorage.removeItem('UserIdSaveChk');
      localStorage.removeItem('saveUserEmail');
    };
  };

  const handleLoginClick = async () => {
    try {
      const response = await api.post(`${process.env.REACT_APP_API_URL}/arentcar/user/users/login`, {
        user_email: userEmail,
        user_password: userPassword,
      });

      if (response.data.users.usage_status === "3") {
        setIsInputPassword(true);
        return;
      }
      // 액세스 토큰 저장
      api.setAccessToken(response.data.token);

      // 서버 응답 구조에 맞게 수정
      // const adminData = response.data.admins;
      // dispatch(setAdminState({
      //   adminCode: adminData.admin_code,
      //   adminName: adminData.admin_name,
      //   adminEmail: adminData.admin_email,
      //   adminRole: adminData.admin_role,
      //   loginState: true,
      // }));
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
          handleLogout();
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
        admin_id: userEmail,
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
    <div className="user-login-wrap">
      <div className="user-login-box-wrap">
        <div className="user-login-box">
          <div className="user-login-area">
            <input type="text" id="userId" maxlength="50" placeholder="아이디를 입력해 주세요." title="입력태그" value={userEmail} onChange={(e) => { setUserEmail(e.target.value) }} />
            <input type="password" id="userPassword" maxlength="50" placeholder="비밀번호를 입력해 주세요." title="입력태그" value={userPassword} onChange={(e) => { setUserPassword(e.target.value) }} />
            <button type="button" className="user-login-button" onClick={handleLoginClick}>로그인</button>
          </div>
          <div className="user-login-bot-wrap">
            <div className="user-login-bot-left">
              <input type="checkbox" name="loginCheck" id="checkSavedID" checked={idSaveChk} onChange={handleIdSaveChkChange} />
              <label for="checkSavedID">아이디 저장</label>
            </div>
            <div className="user-login-bot-right">
              <div>회원가입</div>
              <div>아이디 찾기</div>
            </div>
          </div>
        </div>
      </div>
      <div className="user-login-easy-wrap">
        <div className="user-login-easy-title">간편 로그인</div>
        <div className="user-login-easy-item">
          <button>
            <img className="user-login-easy-kakao" src={`${process.env.REACT_APP_IMAGE_URL}/btn_kakao.png`} alt="" />
          </button>
          <button>
            <img className="user-login-easy-naver" src={`${process.env.REACT_APP_IMAGE_URL}/btn_naver.png`} alt="" />
          </button>
        </div>
      </div>
      {isInputPassword &&
        <div className='manager-popup'>
          <div className='user-login-new-password-wrap'>
            <div className='user-login-new-password-title'>임시 비밀번호 변경</div>
            <div className='user-login-new-password-line'>
              <label className='width100 word-right label-margin-right' htmlFor="newPassword">새로운 비밀번호</label>
              <input className='width300' type="password" id="newPassword" maxlength="50" placeholder="새로운 비밀번호를 입력해 주세요." title="입력태그" value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }} />
            </div>
            <div className='user-login-new-password-line'>
              <label className='width100 word-right label-margin-right' htmlFor="newPassword">확인 비밀번호</label>
              <input className='width300' type="password" id="confirmPassword" maxlength="50" placeholder="확인 비밀번호를 입력해 주세요." title="입력태그" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
            </div>
            <div className='user-login-new-password-line align-right'>
              <button type="button" className="manager-button manager-button-save" onClick={handleNewPasswordClick}>확인</button>
              <button type="button" className="manager-button manager-button-close" onClick={() => setIsInputPassword(false)}>닫기</button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default UserLogin;