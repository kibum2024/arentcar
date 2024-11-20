import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserState } from '../../redux/UserState';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const dispatch = useDispatch();
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    setUserEmail(localStorage.getItem('saveUserEmail'));
    const idSaveChkValue = localStorage.getItem('UserIdSaveChk') === "1" ? true : false;
    if (idSaveChkValue) {
      setIdSaveChk(idSaveChkValue);
    }
  }, []);

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
  //   script.type = 'text/javascript';
  //   script.async = true;
  //   document.body.appendChild(script);

  //   script.onload = () => {
  //     console.log('Naver SDK loaded successfully.');
  //   };

  //   return () => {
  //     document.body.removeChild(script); // 컴포넌트 언마운트 시 스크립트 제거
  //   };
  // }, []);

  useEffect(() => {
    const loadNaverSdk = () => {
        const script = document.createElement('script');
        script.src = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => {
            console.log('네이버 SDK 로드 완료');
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    };

    loadNaverSdk();
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

  const handleIdMemberShipClick = () => {
    setIsMemberShip(true);
  }

  const handleMemberShipClick = () => {
    navigate('/membership');
  }

  const handleKakaoClick = () => {

  }

  const handleNaverClick = () => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: '70Z4zly6MORzKJxt2FRJ',
      callbackUrl: 'http://localhost:3000/naver-callback',
      isPopup: false,
      loginButton: { color: 'green', type: 3, height: '40' },
    });

    const naverLoginElement = document.getElementById('naverIdLogin');
    if (naverLoginElement) {
      naverLogin.init();
      naverLoginElement.firstChild.click(); // 숨겨진 버튼 클릭
    } else {
      console.error('네이버 로그인 버튼 요소를 찾을 수 없습니다.');
    }
  }

  return (
    <div className="user-login-wrap">
      <div className="user-login-box-wrap">
        <div className="user-login-box">
          <form className="user-login-area" onSubmit={handleLoginClick}>
            <div>
              <label htmlFor="userId">아이디</label>
              <input
                type="text"
                id="userId"
                maxLength="50"
                placeholder="아이디를 입력해 주세요."
                title="아이디 입력"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                autoComplete="username" // 자동 완성 속성 추가
              />
            </div>

            <div>
              <label htmlFor="userPassword">비밀번호</label>
              <input
                type="password"
                id="userPassword"
                maxLength="50"
                placeholder="비밀번호를 입력해 주세요."
                title="비밀번호 입력"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                autoComplete="current-password" // 자동 완성 속성 추가
              />
            </div>

            <button type="submit" className="user-login-button">
              로그인
            </button>
          </form>
          {/* <div className="user-login-area">
            <input type="text" id="userId" maxlength="50" placeholder="아이디를 입력해 주세요." title="입력태그" value={userEmail} onChange={(e) => { setUserEmail(e.target.value) }} />
            <input type="password" id="userPassword" maxlength="50" placeholder="비밀번호를 입력해 주세요." title="입력태그" value={userPassword} onChange={(e) => { setUserPassword(e.target.value) }} />
            <button type="button" className="user-login-button" onClick={handleLoginClick}>로그인</button>
          </div> */}
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
          <button>
            <img className="user-login-easy-kakao" src={`${process.env.REACT_APP_IMAGE_URL}/btn_kakao.png`} alt="" />
          </button>
          <div id="naverIdLogin" style={{ display: 'none' }}></div>
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