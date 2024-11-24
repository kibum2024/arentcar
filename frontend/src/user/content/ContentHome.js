import React, { useEffect, useState } from 'react';
import MainSlider from 'user/content/MainSlider';
import 'user/content/ContentHome.css';

let socket; // 전역 변수로 WebSocket 관리

const ContentHome = () => {
  const [serverMessage, setServerMessage] = useState(""); // 서버에서 받은 메시지 저장

  useEffect(() => {
    // WebSocket이 없으면 새로 생성
    if (!socket) {
      socket = new WebSocket("ws://localhost:8080/ws/visitor");

      socket.onopen = () => {
        console.log("WebSocket 연결 성공");
      };

      socket.onmessage = (event) => {
        console.log("서버에서 받은 메시지:", event.data);
        setServerMessage(event.data); // 받은 메시지를 상태에 저장
      };

      socket.onerror = (error) => {
        console.error("WebSocket 오류:", error);
      };

      socket.onclose = () => {
        console.log("WebSocket 연결 종료");
        socket = null; // 연결 종료 시 초기화
      };
    }

    // 컴포넌트 언마운트 시 WebSocket 닫지 않음 (다른 페이지에서도 재사용 가능)
    return () => {
      socket.onmessage = null; // 이벤트 핸들러 제거
    };
  }, []);

  return (
    <div className='content-home-wrap'>
      <MainSlider />
      {/* 서버에서 받은 메시지 표시 */}
      <div className='server-message'>
        <h3>서버 메시지</h3>
        <p>{serverMessage || "서버에서 메시지를 기다리고 있습니다..."}</p>
      </div>
    </div>
  );
};

export default ContentHome;
