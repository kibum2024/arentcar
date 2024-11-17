import React, { useEffect } from 'react';

const NaverCallback = () => {
    useEffect(() => {
        const { naver } = window;

        // 네이버 OAuth 콜백 처리
        naver.LoginWithNaverId.prototype.getLoginStatus(function (status) {
            if (status) {
                const userInfo = naver.user; // 네이버 사용자 정보
                console.log('사용자 정보:', userInfo);
                alert(`로그인 성공! ${userInfo.getName()}님 환영합니다.`);
            } else {
                console.error('로그인 실패');
            }
        });
    }, []);

    return <div>로그인 중...</div>;
};

export default NaverCallback;
