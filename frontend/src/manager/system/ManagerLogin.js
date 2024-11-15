import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserState } from '../../redux/UserState';
import api from 'utility/api';
import { errorChk} from 'utility/Common';
import 'manager/system/ManagerLogin.css';


const ManagerLogin = () => {
  const { showAlert, AlertComponent } = KbUseAlert();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const dispatch = useDispatch();

  const handleLoginClick = async () => {

    // if (!validateCheck()) {
    //   return;
    // }
    
    try {
      const response = await api.post(`${process.env.REACT_APP_API_URL}/api/userMemberships/login`, {
        user_email: userEmail,
        user_password: userPassword,
      });

      // console.log("response accessToken : ", response.data.token);
      api.setAccessToken(response.data.token);
      dispatch(setUserState({
        userRole: response.data.user.user_role,  
        userCode: response.data.user.user_code,
        userName: response.data.user.user_name,
        userEmail: response.data.user.user_email,
        loginState: true
      }));

      await showAlert("로그인되었습니다.");
    } catch (error) {
      await showAlert(errorChk(error));
    } finally {
    }
  };

  return (
    <div>
      <div className="user-login-wrap">
        <div className="user-login-box-wrap">
          <div className="user-login-box">
              <div className="user-login-area">
              <input type="text" id="userId" maxlength="50" placeholder="아이디 또는 이메일을 입력해 주세요." title="입력태그" onChange={(e) => {setUserEmail(e.target.value)}} />
              <input type="password" id="userPassword" maxlength="15" placeholder="비밀번호를 입력해 주세요." title="입력태그" onChange={(e) => {setUserPassword(e.target.value)}} />
              <button type="button" className="btn_login" onClick={handleLoginClick}>로그인</button>
            </div>
            <div className="user-login-bot_wrap">
              <div className="user-login-check">
                <input type="checkbox" name="loginCheck" id="checkSavedID" />
                <label for="checkSavedID">아이디 저장</label>
              </div>
              <div className="user-login-menu">
                <a href="#none" title="페이지 이동">회원가입</a>
                <a href="#none" title="페이지 이동">아이디 찾기</a>
                <a href="#none" title="페이지 이동">비밀번호 찾기</a>
              </div>
            </div>
          </div>
        </div >
      </div >
      {AlertComponent}
    </div >
  );
}

export default ManagerLogin;