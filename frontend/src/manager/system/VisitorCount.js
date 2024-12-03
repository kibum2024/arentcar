import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { refreshAccessToken, handleAdminLogout } from 'common/Common';
import 'manager/system/VisitorCount.css'; 

const VisitorCount = () => {
  const [visitCount, setVisitCount] = useState([]);

  useEffect(() => {
    mainCount();

    const interval = setInterval(() => {
      mainCount();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const mainCount = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await getCount(token);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getCount(newToken);
        } catch (refreshError) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleAdminLogout();
        }
      } else {
        console.error('There was an error fetching the menu!', error);
      }
    }
  };

  const getCount = async (token) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/visitorLog/count`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    setVisitCount(response.data);
  };

  return (
    <div className='visitor-count-wrap'>
      <div className='visitor-count-content' onClick={() => mainCount()}>
        <strong>방문자수 : {visitCount}</strong>
      </div>
    </div>
  );
}

export default VisitorCount;