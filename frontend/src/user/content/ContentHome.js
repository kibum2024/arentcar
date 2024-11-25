import React, { useEffect, useState } from 'react';
import MainSlider from 'user/content/MainSlider';
import 'user/content/ContentHome.css';

let socket; // 전역 변수로 WebSocket 관리

const ContentHome = () => {
  const [serverMessage, setServerMessage] = useState(""); // 서버에서 받은 메시지 저장

  // useEffect(() => {
  //   if (!socket) {
  //     const socket = new WebSocket(process.env.REACT_APP_WS_URL);

  //     socket.onopen = () => {
  //       console.log("WebSocket 연결 성공");
  //     };


  //     socket.onmessage = (event) => {
  //       if (event && event.data) {
  //         setServerMessage(event.data);
  //       }
  //     };

  //     socket.onerror = (error) => {
  //       console.error("WebSocket 오류:", error);
  //     };

  //     socket.onclose = () => {
  //       console.log("WebSocket 연결 종료");
  //       socket = null; 
  //     };
  //   }

  //   return () => {
  //     socket.onmessage = null;
  //   };
  // }, []);

  return (
    <div className='content-home-wrap'>
      <MainSlider />
    </div>
  );
};

export default ContentHome;
