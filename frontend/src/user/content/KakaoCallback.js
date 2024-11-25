import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUserState } from '../../redux/UserState';
import axios from "axios";


const KakaoCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get("code");

      if (code) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/arentcar/user/kakao-login`,
            { code }
          );
          console.log('response.data:', response.data);

					const userData = response.data;

					dispatch(setUserState({
						userCode: userData.user_code,
						userName: userData.user_name,
						userEmail: userData.user_email,
						userCategory: userData.user_category,	
						usageStatus: userData.usage_status,
						loginState: true,
					}));
          navigate('/');
        } catch (error) {
          console.error('Error during login process:', error);
          if (error.response) {
            console.error('Server Error Response:', error.response.data);
          } else {
            console.error('Unexpected Error:', error.message);
          }
        }
      } else {
        console.error("No authorization code found in query parameters.");
      }
    };

    handleCallback();
  }, [navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;
