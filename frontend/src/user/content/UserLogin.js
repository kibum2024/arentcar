import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserState } from '../../redux/UserState';
import axios from 'axios';
import api from 'common/api';
import Loading from 'common/Loading';
import { refreshAccessToken, handleLogout } from 'common/Common';
import 'user/content/UserLogin.css';


const UserLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [findEmail, setFindEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isInputPassword, setIsInputPassword] = useState(false);
  const [isMemberShip, setIsMemberShip] = useState(false);
  const [isPasswordFind, setIsPasswordFind] = useState(false);
  const [idSaveChk, setIdSaveChk] = useState(false);
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

      if (response.data.users.usage_status === "2") {
        alert("사용할 수 없는 아이디입니다. 재가입 후 사용바랍니다.");
        navigate("/login");
        return;
      } else if (response.data.users.usage_status === "3") {
        setIsInputPassword(true);
        return;
      }

      api.setAccessToken(response.data.token);
      const userData = response.data.users;
      dispatch(setUserState({
        userCode: userData.user_code,
        userName: userData.user_name,
        userEmail: userData.user_email,
        userCategory: userData.user_category,
        usageStatus: userData.usage_status,
        loginState: true,
      }));

      navigate("/");
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
      await api.put(`${process.env.REACT_APP_API_URL}/arentcar/user/users/newpassword`,
        {
          user_email: userEmail,
          user_password: newPassword,
        });
      alert("새로운 비밀번호로 변경되었습니다. 로그인바랍니다.");
      setIsInputPassword(false);
    } catch (error) {
        alert("비밀번호 변경  중 오류가 발생하였습니다. " + error.message);
    }
  };

  const validateCheck = () => {
    // if (!emailRegex.test(userEmail)) {
    //   alert("유효하지 않은 이메일 주소입니다.");
    //   return false;
    // };
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

  const loadKakaoSDK = () => {
    return new Promise((resolve, reject) => {
      if (window.Kakao) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
        script.onload = () => {
          if (!window.Kakao.isInitialized()) {
            window.Kakao.init('fb404d662dae6dcdb051b6460f0dbb35');
            console.log('Kakao SDK initialized');
          }
          resolve();
        };
        script.onerror = () => reject('Failed to load Kakao SDK');
        document.body.appendChild(script);
      }
    });
  };

  const handleKakaoClick = async () => {
    try {
      await loadKakaoSDK();
      window.Kakao.Auth.logout(() => {
        console.log('카카오 로그아웃 완료');
        window.Kakao.Auth.authorize({
          redirectUri: 'http://localhost:3000/kakao-callback',
        });
      });
    } catch (error) {
      console.error('Kakao SDK load error:', error);
    }
  };

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

  const handlePasswordFindClick = () => {
    setIsPasswordFind(true);
  }

  const handleFindeEmailClick = async () => {
    if (window.confirm('임시비밀번호를 발급하시겠습니까?')) {
      try {
        setLoading(true);
        await axios.put(`${process.env.REACT_APP_API_URL}/arentcar/user/users/issue/${findEmail}`, {});
        alert("임시비밀번호가 발급되었습니다.\n메일 확인 후 비밀번호를 재설정하세요.");
        setIsPasswordFind(false);
      } catch (error) {
        if (error.response.status === 404) {
          alert("이메일 주소를 확인 후 다시 시도하세요.")
        } else {
          alert("임시비밀번호 중 오류가 발생했습니다." + error);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="user-login-wrap">
      <div className="user-login-box-wrap">
        <div className="user-login-box">
          <div className="user-login-area">
            <input type="text" id="userId" maxlength="50" placeholder="이메일을 입력해 주세요." title="입력태그" value={userEmail} onChange={(e) => { setUserEmail(e.target.value) }} />
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
              <div onClick={handlePasswordFindClick}>비밀번호 재설정</div>
            </div>
          </div>
        </div>
      </div>
      <div className="user-login-easy-wrap">
        <div className="user-login-easy-title">간편 로그인</div>
        <div className="user-login-easy-item">
          <button onClick={handleKakaoClick}>
            <img className="user-login-easy-kakao" src={`${process.env.REACT_APP_IMAGE_URL}/btn_kakao.png`} alt="" />
          </button>
          <div id="naverIdLogin" style={{ display: 'none' }}></div>
          <button onClick={handleNaverClick}>
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
      {isPasswordFind &&
        <div className='manager-popup'>
          <div className='user-login-popup-password-find-wrap'>
            <div className='manager-title'>● 비밀번호 재설정</div>
            <div className='user-login-popup-password-find-email'>
              <label htmlFor="">이메일</label>
              <input className='width300' type="text" id="userId" maxlength="50" placeholder="회원가입때 사용한 이메일을 입력해 주세요." title="입력태그" value={findEmail} onChange={(e) => { setFindEmail(e.target.value) }} />
            </div>
            <div className='user-login-popup-password-find-button'>
              <button className="manager-button" onClick={handleFindeEmailClick}>확인</button>
              <button className="manager-button" onClick={() => setIsPasswordFind(false)}>닫기</button>
            </div>
          </div>
        </div>
      }
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
      {loading && (
        <Loading />
      )}

    </div>
  );
}

export default UserLogin;