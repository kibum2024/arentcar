import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from 'common/api';
import { refreshAccessToken, handleLogout } from 'common/Common';
import 'user/content/UserLogin.css';


const UserLogin = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isInputPassword, setIsInputPassword] = useState(false);
  const [isMemberShip, setIsMemberShip] = useState(false);
  const [idSaveChk, setIdSaveChk] = useState(false);
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    setUserEmail(localStorage.getItem('saveUserEmail'));
    const idSaveChkValue = localStorage.getItem('UserIdSaveChk') === "1" ? true : false;
    if (idSaveChkValue) {
      setIdSaveChk(idSaveChkValue);
    }
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.onload = () => {
      window.Kakao.init('78c17c6c2ffdd5fe383edf297c5be8f5');
    };
    document.body.appendChild(script);
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

      if (response.data.users.usage_status === "2") {
         alert("사용할 수 없는 아이디입니다. 재가입 후 사용바랍니다.");
         navigate("/login");
        return;
      }
      api.setAccessToken(response.data.token);
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

  const handleIdMemberShipClick = () => {
    setIsMemberShip(true);
  }

  const handleMemberShipClick = () => {
    navigate('/membership');
  }

  const handleKakaoLoginClick = () => {
    window.Kakao.Auth.login({
      success: function (authObj) {
        console.log(authObj.access_token);
        axios.post(`${process.env.REACT_APP_API_URL}/arentcar/user/kakao-login`, {
          accessToken: authObj.access_token
        }, {
          headers: {
            'Content-Type': 'application/json'  
          }
        })
          .then(response => {
            navigate('/');
          })
          .catch(error => {
            console.error('Login Error:', error);
          });
      },
      fail: function (err) {
        console.error('Login Failed:', err);
      }
    });
  }

  const handleNaverLoginClick = () => {
    if (typeof window.naver === "undefined" || !window.naver.LoginWithNaverId) {
      const naverLoginScript = document.createElement("script");
      naverLoginScript.src = "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js"; // 최신 버전 사용
      document.body.appendChild(naverLoginScript);

      naverLoginScript.onload = () => {
        console.log("네이버 로그인 SDK 로드 완료");
        initializeNaverLogin();
      };
    } else {
      console.log("네이버 로그인 SDK 이미 로드됨");
      initializeNaverLogin();
    }
  };

  const initializeNaverLogin = () => {
    try {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: "tZmqhZO1NzVp8B5iVi2F",
        callbackUrl: "http://localhost:8080/arentcar/user/naver/callback",
        isPopup: false,
        loginButton: { color: 'green', type: 3, height: '40' },
        state: "RANDOM_STATE_VALUE",
        // state: Math.random().toString(36).substring(2, 10), 
      });

      const naverLoginElement = document.getElementById('naverIdLogin');
      if (naverLoginElement) {
        naverLogin.init();
        naverLoginElement.firstChild.click();
      } else {
        console.error('네이버 로그인 버튼 요소를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error("네이버 로그인 초기화 중 오류:", error);
    }
  };

  const handleKakaoClick = () => {

  }

  const handleNaverClick = () => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: 'tZmqhZO1NzVp8B5iVi2F',
      callbackUrl: 'http://localhost:3000/naver-callback',
      isPopup: false,
      loginButton: { color: 'green', type: 3, height: '40' },
      state: Math.random().toString(36).substring(2, 10),
    });

    const naverLoginElement = document.getElementById('naverIdLogin');
    if (naverLoginElement) {
      naverLogin.init();
      naverLoginElement.firstChild.click();
    } else {
      console.error('네이버 로그인 버튼 요소를 찾을 수 없습니다.');
    }
  }

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
              <div onClick={handleIdMemberShipClick}>회원가입</div>
              <div>아이디 찾기</div>
            </div>
          </div>
        </div>
      </div>
      <div className="user-login-easy-wrap">
        <div className="user-login-easy-title">간편 로그인</div>
        <div className="user-login-easy-item">
          <button onClick={handleKakaoLoginClick}>
            <img className="user-login-easy-kakao" src={`${process.env.REACT_APP_IMAGE_URL}/btn_kakao.png`} alt="" />
          </button>
          <div id="naverIdLogin" style={{ display: 'none' }}></div>
          <button onClick={handleNaverLoginClick}>
            <img className="user-login-easy-naver" src={`${process.env.REACT_APP_IMAGE_URL}/btn_naver.png`} alt="" />
          </button>
        </div>
      </div>
      {isMemberShip &&
        <div className='manager-popup'>
          <div className="user-login-membership-popup_wrap">
            <div className="user-login-membership-popup-title-wrap">
              <div className="user-login-membership-popup-title">가입 방법을 선택해 주세요</div>
              <button className="manager-button" onClick={() => setIsMemberShip(false)}>닫기</button>
            </div>
            <div className="user-login-membership-popup-content">
              <div className="user-login-popup-button user-login-membership" onClick={handleMemberShipClick}>A렌터카 회원가입</div>
              <div className="user-login-easy-popup">간편 회원가입</div>
              <div className="user-login-popup-button user-login-kakao" onClick={handleKakaoClick}>
                <img className="user-login-easy-kakao" src={`${process.env.REACT_APP_IMAGE_URL}/btn_kakao.png`} alt="" />
                <span>카카오로 시작하기</span>
              </div>
              <div className="user-login-popup-button user-login-naver" onClick={handleNaverClick}>
                <img className="user-login-easy-naver" src={`${process.env.REACT_APP_IMAGE_URL}/btn_naver.png`} alt="" />
                <span>네이버로 시작하기</span>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default UserLogin;