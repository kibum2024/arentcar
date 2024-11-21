import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserState } from '../../redux/UserState';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function NaverCallback() {
	const [isRequesting, setIsRequesting] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const naverLogin = new window.naver.LoginWithNaverId({
			clientId: 'tZmqhZO1NzVp8B5iVi2F',
			callbackUrl: 'http://localhost:3000/naver-callback',
		});

		naverLogin.init();

		// 네이버 로그인 상태 확인
		naverLogin.getLoginStatus(async (status) => {
			if (status && !isRequesting) {
				const token = naverLogin.accessToken.accessToken;
				setIsRequesting(true);

				try {
					// 서버로 액세스 토큰 전송
					const response = await axios.post(
						`${process.env.REACT_APP_API_URL}/arentcar/user/naver-login`,
						{ token },
						{ headers: { 'Content-Type': 'application/json' } }
					);

					const userData = response.data;
					console.log('서버 userData:', response.data);

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
					if (error.response) {
						console.error('서버 응답 에러:', error.response.data);
					} else {
						console.error('요청 처리 중 에러 발생:', error.message);
					}
				} finally {
					setIsRequesting(false);
				}
			} else {
				console.error('로그인 실패: 네이버에서 상태를 확인할 수 없습니다.');
			}
		});
	}, []);

	return <div>네이버 로그인 처리 중...</div>;
};

export default NaverCallback;
