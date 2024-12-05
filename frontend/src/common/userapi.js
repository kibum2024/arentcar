import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// 액세스 토큰 및 리프레시 토큰 저장소
let accessToken = localStorage.getItem('accessToken') || null;

// 액세스 토큰 설정 함수
const setAccessToken = (token) => {
  accessToken = token;
  localStorage.setItem('accessToken', token);
};

// JWT 만료 확인 함수
const isTokenExpired = (token) => {
  // console.log(token);
  if (token === null || typeof token === 'undefined' || token === '' || token === 'undefined') {
    return false;
  }
  const decoded = jwtDecode(token);
  // const gracePeriod = 5 * 60 * 1000;
  // console.log("decoded.exp * 1000 : ", decoded.exp * 1000);
  // console.log("Date.now() : ", Date.now());

  return (decoded.exp * 1000) < Date.now(); 
  // return (decoded.exp * 1000) - gracePeriod < Date.now(); 
};

// 액세스 토큰을 재발급하는 함수
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/arentcar/user/users/refresh`, {}, { withCredentials: true });
    const newAccessToken = response.data.accessToken;
    setAccessToken(newAccessToken); 
    return newAccessToken;
  } catch (error) {
    console.error('액세스 토큰 재발급 실패:', error);
    throw error;
  }
};

// Axios 인스턴스 생성
const userapi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // 쿠키를 자동으로 포함 (리프레시 토큰)
});

userapi.setAccessToken = setAccessToken;

// Axios 요청 인터셉터
userapi.interceptors.request.use(
  async (config) => {
    if (isTokenExpired(accessToken)) {
      // console.log('액세스 토큰 만료. 리프레시 토큰을 사용해 재발급 요청.');
      try {
        accessToken = await refreshAccessToken(); 
      } catch (error) {
        // console.error('토큰 재발급 실패. 로그아웃 처리 또는 다른 작업.');
        throw error; // 실패 시 에러를 던져서 요청을 중단
      }
    }
    // 헤더에 기존/신규 액세스 토큰 추가
    config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default userapi;
