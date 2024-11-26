import React, { useEffect, useState } from 'react';
import 'manager/system/ConnectionStatus.css'; 

const ConnectionStatus = () => {
  const [connectionInfo, setConnectionInfo] = useState({ count: 0, ips: [] }); 
  const [isConnected, setIsConnected] = useState(false); 

  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WS_URL);

    socket.onopen = () => {
      setIsConnected(true); 
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); 
        setConnectionInfo({
          count: data.count, // 접속자 수
          ips: data.ips, // 접속 IP 목록
        });
      } catch (error) {
        console.error("메시지 파싱 오류:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket 오류:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket 연결 종료");
      setIsConnected(false); // WebSocket 연결 상태 업데이트
    };

    // 컴포넌트 언마운트 시 WebSocket 닫기
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="connection-status-wrap">
      <div className="connection-status-title"><strong>실시간 접속현황</strong>
        <div className="connection-status-count">({connectionInfo.count}개 접속)</div>
      </div>
      {/* <div className={`status ${isConnected ? "connected" : "disconnected"}`}>
        {isConnected ? "연결됨" : "연결되지 않음"}
      </div> */}
      <div className="connection-status-info">
        <div className="connection-status-count">현재 접속자 수: <strong>{connectionInfo.count}</strong></div>
        <div className="connection-status-ip-title">접속 IP목록</div>
        <div className="connection-status-ip-info">
          <ul>
            {connectionInfo.ips.map((ip, index) => (
              <li key={index}>{ip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;
