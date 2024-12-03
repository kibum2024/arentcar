import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { refreshAccessToken, handleLogout } from 'common/Common';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const RvCharts = ( {stats} ) => {
  const [dataDayCount, setDataDayCount] = useState([]);
  const [dataAgeCount, setDataAgeCount] = useState([]);

  const getDayChartsCount = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await dayChartsCount(token);
    } catch (error) {
      if(error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await dayChartsCount(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the movies!', error);
      }
    }
  }
  const dayChartsCount = async (token) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/reviews/dayCount`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    );
    if (response.data) {
      setDataDayCount(response.data);
      console.log(response.data);
      
    }
  }

  const getAgeChartsCount = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await ageChartsCount(token);
    } catch (error) {
      if(error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await ageChartsCount(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the movies!', error);
      }
    }
  }
  const ageChartsCount = async (token) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/reviews/ageCount`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    );
    if (response.data) {
      setDataAgeCount(response.data);
      console.log(response.data);
      
    }
  }

  useEffect(()=>{
    getDayChartsCount();
    getAgeChartsCount();
  },[stats])

  // .reverse()
  return (<div> 
    <ResponsiveContainer width="100%" height={400}>
      {stats === 0 && (
        <BarChart data={dataDayCount.reverse()}>
          <XAxis dataKey="column_name"/>
          <YAxis />
          <Tooltip />
          <Bar dataKey="count_rv" fill="#3b70d6" />
        </BarChart>
      )}
      {stats === 1 && (
        <BarChart data={dataAgeCount}>
          <XAxis dataKey="column_name"/>
          <YAxis />
          <Tooltip />
          <Bar dataKey="count_rv" fill="#3b70d6" />
        </BarChart>
      )}


    </ResponsiveContainer>
  </div>);
}

const AvgCharts = ( {stats} ) => {
  const [dataDayAvg, setDataDayAvg] = useState([]);
  const [dataAgeAvg, setDataAgeAvg] = useState([]);

  const getDayChartsAvg = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await dayChartsAvg(token);
    } catch (error) {
      if(error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await dayChartsAvg(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the movies!', error);
      }
    }
  }
  const dayChartsAvg = async (token) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/reviews/dayAvg`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    );
    if (response.data) {
      setDataDayAvg(response.data);
      console.log(response.data);
      
    }
  }

  const getAgeChartsAvg = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await ageChartsAvg(token);
    } catch (error) {
      if(error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await ageChartsAvg(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleLogout();
        }
      } else {
        console.error('There was an error fetching the movies!', error);
      }
    }
  }
  const ageChartsAvg = async (token) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/post/reviews/ageAvg`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    );
    if (response.data) {
      setDataAgeAvg(response.data);
      console.log(response.data);
    }
  }

  useEffect(()=>{
    getDayChartsAvg();
    getAgeChartsAvg();
  },[stats])

  return (<div>
    <ResponsiveContainer width="100%" height={400}>
    {stats === 0 && (
      <LineChart data={dataDayAvg.reverse()}> <div>123</div>
        <XAxis dataKey="column_name"/>
        <YAxis />
        <Tooltip />
        <Line dataKey="avg_rv" strokeWidth={3} />
      </LineChart> 
    )}
    {stats === 1 && (
      <BarChart data={dataAgeAvg}>
        <XAxis dataKey="column_name"/>
        <YAxis />
        <Tooltip />
        <Bar dataKey="avg_rv" fill="#3b70d6" />
      </BarChart>
    )}


    </ResponsiveContainer>
  </div>);
}

export { AvgCharts, RvCharts };