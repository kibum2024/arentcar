import React, { useEffect } from 'react';

const NaverLogin = () => {
    useEffect(() => {
        const { naver } = window;

        const naverLogin = new naver.LoginWithNaverId({
            clientId: '70Z4zly6MORzKJxt2FRJ', // 네이버 개발자 센터에서 발급받은 Client ID
            callbackUrl: 'http://localhost:3000/naver-callback', // 등록한 Callback URL
            isPopup: false, // 팝업 여부 (true: 팝업 로그인, false: 리다이렉트 로그인)
            loginButton: { color: 'green', type: 3, height: 40 }, // 로그인 버튼 스타일
        });

        naverLogin.init();
    }, []);

    return (
        <div id="naverIdLogin" style={{ margin: '20px auto' }}>
            {/* 네이버 로그인 버튼 렌더링 */}
        </div>
    );
};

export default NaverLogin;
