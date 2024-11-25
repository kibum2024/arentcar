import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'user/content/UserMemberShip.css';


const UserMemberShip = () => {
  const navigate = useNavigate();
  const [totalChk, setTotalChk] = useState(false);
  const [agree01, setAgree01] = useState(false);
  const [agree02, setAgree02] = useState(false);
  const [prsnInfoPeriod, setPrsnInfoPeriod] = useState(false);
  const [mktAgree, setMktAgree] = useState(false);
  const [smsRcvAgree, setSmsRcvAgree] = useState(false);
  const [emailRcvAgree, setEmailRcvAgree] = useState(false);
  const [registerPopup, setRegisterPopup] = useState(false);
  const [duplicateChk, setDuplicateChk] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,20}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^01[0|1|6|7|8|9]\d{3,4}\d{4}$/;


  const handelTotalChkClick = () => {
    setTotalChk((prev) => {
      const newValue = !prev;
      setAgree01(newValue);
      setAgree02(newValue);
      setPrsnInfoPeriod(newValue);
      setMktAgree(newValue);
      setSmsRcvAgree(newValue);
      setEmailRcvAgree(newValue);
      return newValue;
    });
  };

  const handelAgree01ChkClick = () => {
    setAgree01((prev) => {
      const newValue = !prev;
      if (newValue && agree02) {
        setTotalChk(true);
      } else {
        setTotalChk(false);
      };
      return newValue;
    });
  };

  const handelAgree02ChkClick = () => {
    setAgree02((prev) => {
      const newValue = !prev;
      if (newValue && agree01) {
        setTotalChk(true);
      } else {
        setTotalChk(false);
      };
      return newValue;
    });
  };

  const handelPrsnInfoPeriodChkClick = () => {
    setPrsnInfoPeriod(prev => !prev);
  };

  const handelMktAgreeChkClick = () => {
    setMktAgree(prev => !prev);
  };

  const handelSmsRcvAgreeChkClick = () => {
    setSmsRcvAgree(prev => !prev);
  };

  const handelEmailRcvAgreeChkClick = () => {
    setEmailRcvAgree(prev => !prev);
  };

  const handleAgreeClick = () => {
    setRegisterPopup(true);
  }

  const validateCheck = () => {
    if (!emailRegex.test(userEmail)) {
      alert("유효하지 않은 이메일 주소입니다.");
      return false;
    };
    if (!duplicateChk) {
      alert("중복버튼을 클릭하여 이메일 중복여부 확인하세요.");
      return false;
    };
    if (!passwordRegex.test(userPassword)) {
      alert("한개의 알파벳, 숫자, 특수문자와 10자 이상, 20자 이내로 입력해주세요.");
      return false;
    };
    if (userPassword !== confirmPassword) {
      alert("두개의 비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
      return false;
    };
    if (!phoneRegex.test(userPhoneNumber)) {
      alert("유효하지 않은 휴대폰번호입니다.");
      return false;
    };
    return true;
  };

  const handleMemberInsertClick = async () => {
    if (!validateCheck()) {
      return;
    }

    let newUser = {
      user_email: userEmail,
      user_name: userName,
      user_password: userPassword,
      user_phone_number: userPhoneNumber,
      user_category: "1",
      usage_status: "1",
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/arentcar/user/users`, newUser);
      alert("자료가 등록되었습니다.");
      navigate('/login');
    } catch (error) {
      alert("등록 중 오류가 발생했습니다." + error);
    }
  };

  const handleDuplicateChkClick = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/user/users/email/${userEmail}`);
      setDuplicateChk(false);
      alert("이미 사용 중인 이메일 주소입니다. 다른 이메일 주소를 입력하세요.");
    } catch (error) {
      setDuplicateChk(true);
      alert("사용 가능한 이메일 주소입니다.");
    }
  }

  return (
    <div className='user-membership-wrap'>
      <div className='user-membership-agree-wrap'>
        <div className="user-membership-title-wrap">A렌터카 약관동의</div>
        <div className="user-membership-title-content">A렌터카 회원가입을 위해 이용약관에 동의해 주세요.</div>
        <div className="user-membership-content-wrap">
          <div className="user-membership-content">
            <div className="user-membership-content-agree-wrap">
              <div className="user-membership-content-agree-check total_chk" onClick={handelTotalChkClick}>
                {totalChk ?
                  <img className="user-login-agree-image" src={`${process.env.REACT_APP_IMAGE_URL}/ico_chk_24x24.png`} alt="" />
                  :
                  <img className="user-login-agree-image" src={`${process.env.REACT_APP_IMAGE_URL}/ico_chk_gray_24x24.png`} alt="" />
                }
                <label className='chk-label' for="totalChk">모든 필수/선택 약관을 확인하고 전체 동의합니다.</label>
              </div>
              <ul className="user-membership-content-agree-list">
                <li>
                  <div className="chk-box" onClick={handelAgree01ChkClick}>
                    {agree01 ?
                      <img className="user-login-agree-image" src={`${process.env.REACT_APP_IMAGE_URL}/ico_chk_24x24.png`} alt="" />
                      :
                      <img className="user-login-agree-image" src={`${process.env.REACT_APP_IMAGE_URL}/ico_chk_gray_24x24.png`} alt="" />
                    }
                    <label className='chk-label' for="agree01">A렌터카 이용약관(필수)</label>
                  </div>
                </li>
                <li>
                  <div className="chk-box" onClick={handelAgree02ChkClick}>
                    {agree02 ?
                      <img className="user-login-agree-image" src={`${process.env.REACT_APP_IMAGE_URL}/ico_chk_24x24.png`} alt="" />
                      :
                      <img className="user-login-agree-image" src={`${process.env.REACT_APP_IMAGE_URL}/ico_chk_gray_24x24.png`} alt="" />
                    }
                    <label className='chk-label' for="agree02">개인정보 수집 및 이용 동의(필수)</label>
                  </div>
                </li>
                <li>
                  <div className="chk-box" onClick={handelPrsnInfoPeriodChkClick}>
                    {prsnInfoPeriod ?
                      <img className="user-login-agree-image" src={`${process.env.REACT_APP_IMAGE_URL}/ico_chk_24x24.png`} alt="" />
                      :
                      <img className="user-login-agree-image" src={`${process.env.REACT_APP_IMAGE_URL}/ico_chk_gray_24x24.png`} alt="" />
                    }
                    <label className='chk-label' for="prsnInfoPeriod">개인정보 유효기간 5년 동의(선택)</label>
                  </div>
                </li>
                <li>
                  <div className="chk-box" onClick={handelMktAgreeChkClick}>
                    {mktAgree ?
                      <img className="user-login-agree-image" src={`${process.env.REACT_APP_IMAGE_URL}/ico_chk_24x24.png`} alt="" />
                      :
                      <img className="user-login-agree-image" src={`${process.env.REACT_APP_IMAGE_URL}/ico_chk_gray_24x24.png`} alt="" />
                    }
                    <label className='chk-label' for="mktAgree">마케팅 활용 동의(선택)</label>
                  </div>
                </li>
                <li>
                  <div className="chk-box" onClick={handelSmsRcvAgreeChkClick}>
                    {smsRcvAgree ?
                      <img className="user-login-agree-image" src={`${process.env.REACT_APP_IMAGE_URL}/ico_chk_24x24.png`} alt="" />
                      :
                      <img className="user-login-agree-image" src={`${process.env.REACT_APP_IMAGE_URL}/ico_chk_gray_24x24.png`} alt="" />
                    }
                    <label className='chk-label' for="smsRcvAgree">SMS 수신동의(선택)</label>
                  </div>
                </li>
                <li>
                  <div className="chk-box" onClick={handelEmailRcvAgreeChkClick}>
                    {emailRcvAgree ?
                      <img className="user-login-agree-image" src={`${process.env.REACT_APP_IMAGE_URL}/ico_chk_24x24.png`} alt="" />
                      :
                      <img className="user-login-agree-image" src={`${process.env.REACT_APP_IMAGE_URL}/ico_chk_gray_24x24.png`} alt="" />
                    }
                    <label className='chk-label' for="emailRcvAgree"> 이메일 수신동의(선택)</label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="user-membership-content-agree-message">
            고객님에게는 동의를 거부할 권리가 있으나, 약관에 동의하셔야 A렌터카 서비스를 이용할 수 있습니다.
          </div>
        </div>
        <div className="user-membership-content-agree-button-wrap">
          <button className="user-membership-content-agree-button" style={{ backgroundColor: agree01 && agree02 ? 'rgba(251, 115, 37' : '#ccc', cursor: agree01 && agree02 ? 'pointer' : 'default' }} disabled={!(agree01 && agree02)} onClick={handleAgreeClick}>동의 완료</button>
        </div>
      </div>
      {registerPopup &&
        <div className='manager-popup'>
          <div className="user-membership-register-popup-wrap">
            <div className="user-membership-register-popup-title-wrap">
              <div className="user-membership-register-popup-title">회원정보를 입력해 주세요.</div>
              <button className="manager-button" onClick={() => {setRegisterPopup(false); setDuplicateChk(false)}}>닫기</button>
            </div>
            <div className="user-membership-register-popup-content-wrap">
              <div className="user-membership-register-popup-content">
                <div className="label-name">이메일</div>
                <div className="user-membership-register-popup-content-email">
                  <input className='width250' type="text" id="id" name="id" value={userEmail} onChange={(e) => { setUserEmail(e.target.value) }} />
                  <button className="manager-button" onClick={handleDuplicateChkClick}>중복</button>
                </div>
                <div className="ex-box">
                  <p className="user-membership-register-popup-content-message">이메일주소</p>
                </div>
              </div>
              <div className="user-membership-register-popup-content">
                <div className="label-name">성명</div>
                <input className='width350' type="text" id="id" name="id" value={userName} onChange={(e) => { setUserName(e.target.value) }} />
                <div className="ex-box">
                  <p className="user-membership-register-popup-content-message">성명</p>
                </div>
              </div>
              <div className="user-membership-register-popup-content">
                <div className="label-name">비밀번호</div>
                <input className='width350' type="password" id="password" maxlength="50" value={userPassword} onChange={(e) => { setUserPassword(e.target.value) }} />
                <div className="ex-box">
                  <p className="user-membership-register-popup-content-message">영문, 숫자, 특수문자 포함 10~20자 이내</p>
                </div>
              </div>
              <div className="user-membership-register-popup-content">
                <div className="label-name">비밀번호 확인</div>
                <input className='width350' type="password" id="confirmPassword" maxlength="50" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
                <div className="ex-box">
                  <p className="user-membership-register-popup-content-message">비밀번호를 다시 입력해주세요</p>
                </div>
              </div>
              <div className="user-membership-register-popup-content">
                <div className="label-name">휴대폰번호</div>
                <input className='width350' type="text" id="id" name="id" value={userPhoneNumber} onChange={(e) => { setUserPhoneNumber(e.target.value) }} />
                <div className="ex-box">
                  <p className="user-membership-register-popup-content-message">휴대폰번호를 "-" 없이 입력해주세요</p>
                </div>
              </div>
            </div>
            <div className="user-membership-register-popup-confirm-wrap">
              <button className="user-membership-register-popup-confirm-button " onClick={handleMemberInsertClick}>확인</button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default UserMemberShip;