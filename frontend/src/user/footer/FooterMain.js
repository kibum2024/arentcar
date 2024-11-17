import React from 'react';
import 'user/footer/FooterMain.css';

const FooterMain = () => {
  return (
    <div classNameName='footer-main-wrap'>
      <div className="footer-main-info">
        <div className="footer-main-logo"><img src={`${process.env.REACT_APP_IMAGE_URL}/arentcar.png`} alt="logo Footer" /></div>
        <div className="footer-main-comment">회사소개 | 이용약관 | 개인정보처리방침 | 이메일무단수집거부 | 고정형 영상정보처리기기 운영 및 관리방침 | 채용안내 | 사회적책임</div>
        <div className="footer-main-comment">16269 경기도 수원시 장안구 정조로 940-1(영화동, 연세IT미래교육원 빌딩) Tel : 031-256-2662 Fax : 031-256-2663</div>
        <div className="footer-main-comment">대표 이메일 arentcar.co.kr | 고객센터 1544-8855 (유료) | 사업자등록번호 313-87-00979 | 통신판매업신고번호 제1184호사업자정보확인</div>
        <div className="footer-main-comment">대표이사 양무리 | 개인정보 보호 책임자 강미라 | 기획 김다래 | 홍보 민지환</div>
        <div className="footer-main-comment">Copyright © Arentcar All Right Reserved.</div>
      </div>
    </div>
  );
}

export default FooterMain;
