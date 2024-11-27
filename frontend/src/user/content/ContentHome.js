import React, { useEffect, useState } from 'react';
import MainSlider from 'user/content/MainSlider';
import 'user/content/ContentHome.css';

let socket; // 전역 변수로 WebSocket 관리

const ContentHome = () => {
  const [serverMessage, setServerMessage] = useState(""); 

  // useEffect(() => {
  //   console.log("WebSocket 시작");

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

  // console.log("WebSocket 밖");

  return (
    <div className='content-home-wrap'>
      <MainSlider />
    </div>
  );
};

export default ContentHome;
