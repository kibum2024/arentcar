import axios from 'axios';
import Cookies from 'js-cookie';

// 날짜 형식 변환 함수
export const formatDate = (date) => {
  if (!date) {
    return "";  // 날짜가 없으면 빈 문자열 반환
  }

  // date가 숫자 형식일 때 (예: 20240916)
  const dateStr = date.toString();  // 숫자형일 수도 있으므로 문자열로 변환

  if (dateStr.length === 8) {
    const year = dateStr.slice(0, 4);    // 앞 4자리: 연도
    const month = dateStr.slice(4, 6);   // 중간 2자리: 월
    const day = dateStr.slice(6, 8);     // 마지막 2자리: 일

    return `${year}-${month}-${day}`;    // YYYY-MM-DD 형식으로 반환
  }
  return "";  // 형식이 맞지 않으면 빈 문자열 반환
};

export const formatTime = (time) => {
  if (!time) {
    return "";  // 날짜가 없으면 빈 문자열 반환
  }

  // date가 숫자 형식일 때 (예: 20240916)
  const timeStr = time.toString();  // 숫자형일 수도 있으므로 문자열로 변환

  if (timeStr.length === 4) {
    const hour = timeStr.slice(0, 2);   
    const menute = timeStr.slice(2, 4); 

    return `${hour}:${menute}`;    // hh:mm 형식으로 반환
  }
  return ""; 
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) {
    return ""; 
  }
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작하므로 +1
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 휴대폰번호 형식 변환 함수
export const formatPhone = (date) => {
  if (!date) {
    return ""; 
  }

  // date가 숫자 형식일 때 (예: 01011112222)
  const dateStr = date.toString(); 

  if (dateStr.length === 11) {
    const phoneNumber1 = dateStr.slice(0, 3);    
    const phoneNumber2 = dateStr.slice(3, 7);  
    const phoneNumber3 = dateStr.slice(7, 11);    

    return `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`;  
  }
  return "";  
};

export const errorChk = (error) => {
  if (!error) {
    return ""; 
  }

  const ERROR_CODES = [
    { code: 200, name: "OK", message: "정상적으로 처리가 되었습니다." },
    { code: 201, name: "CREATED", message: "정상적으로 자료가 저장되었습니다." },
    { code: 202, name: "ACCEPTED", message: "정상적으로 요청이 되었습니다." },
    { code: 302, name: "FOUND", message: "요청한 서비스가 일시적으로 이동됩니다." },
    { code: 304, name: "NOT_MODIFIED", message: "자료를 수정할 수 없습니다." },
    { code: 400, name: "BAD_REQUEST", message: "잘못된 서비스 요청입니다." },
    { code: 401, name: "UNAUTHORIZED", message: "인증이 필요합니다." },
    { code: 403, name: "FORBIDDEN", message: "접근권한이 없습니다." },
    { code: 404, name: "NOT_FOUND", message: "요청한 자료가 없습니다." },
    { code: 406, name: "NOT_ACCEPTABLE", message: "요청한 서비스는 허용되지 않았습니다." },
    { code: 407, name: "PROXY_AUTHENTICATION_REQUIRED", message: "프록시 인증이 필요함" },
    { code: 408, name: "REQUEST_TIMEOUT", message: "요청 시간 초과" },
    { code: 409, name: "CONFLICT", message: "요청이 충돌함" },
    { code: 410, name: "GONE", message: "요청한 리소스가 더 이상 존재하지 않음" },
    { code: 412, name: "PRECONDITION_FAILED", message: "전제 조건 실패" },
    { code: 414, name: "URI_TOO_LONG", message: "요청 URI가 너무 깁니다." },
    { code: 415, name: "UNSUPPORTED_MEDIA_TYPE", message: "지원되지 않는 미디어 유형입니다." },
    { code: 500, name: "INTERNAL_SERVER_ERROR", message: "서버 내부에 오류가 발생하였습니다." },
    { code: 501, name: "NOT_IMPLEMENTED", message: "요청한 기능이 구현되지 않아 서비스가 불가능합니다." },
    { code: 502, name: "BAD_GATEWAY", message: "잘못된 게이트웨이입니다." },
    { code: 503, name: "SERVICE_UNAVAILABLE", message: "서비스를 이용할 수 없습니다." },
    { code: 504, name: "GATEWAY_TIMEOUT", message: "네트워크에 문제가 발생하였습니다." },
    { code: 505, name: "HTTP_VERSION_NOT_SUPPORTED", message: "지원하지 않는 HTTP 버전입니다." },
  ];

  const status = error.response.status;
  let messageError = error.response.data;
  if (error.response) {
    const errorCode = ERROR_CODES.find((error) => error.code === status) || { 
      code: 999, 
      name: "UNKNOWN_ERROR", 
      message: "알 수 없는 오류가 발생했습니다.(고객센터에 문의바랍니다.)" 
    };
    if (!error.response.data) {
      messageError = errorCode.message;
    }
    return `${messageError}(${errorCode.code})`;
  } else if (error.request) {
    return "서버에 접속할 수 없습니다.(998)";
  } else {
    return "클라이언트에 문제가 발생하였습니다.(997)";
  }
};

export const isValidDateFormat = (dateString) => {
  // YYYY-MM-DD 형식에 맞는지 확인하는 정규식
  const datePattern = /^\d{4}\d{2}\d{2}$/;

  // 형식이 맞는지 확인
  if (!datePattern.test(dateString)) {
    return false;
  }
  
  // 형식이 맞으면, 실제로 유효한 날짜인지 확인
  const year = Number(dateString.slice(0, 4));
  const month = Number(dateString.slice(4, 6));
  const day = Number(dateString.slice(6, 8));
  const date = new Date(year, month - 1, day);

  // 입력된 날짜와 비교하여 유효성 검사
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export const isValidTimeFormat = (timeString) => {
  const timePattern = /^\d{4}$/; // HHmm 형식 확인 (24시간 형식, 4자리 숫자)

  // 형식이 맞는지 확인
  if (!timePattern.test(timeString)) {
    return false;
  }

  // HHmm을 분리하여 시간과 분을 숫자로 변환
  const hour = parseInt(timeString.slice(0, 2), 10);
  const minute = parseInt(timeString.slice(2, 4), 10);

  // 유효한 24시간과 60분 형식인지 확인
  return hour >= 0 && hour < 24 && minute >= 0 && minute < 60;
};

export const refreshAccessToken = async () => {
  const refreshToken = Cookies.get('refreshToken'); 
  if (!refreshToken) {
    throw new Error('다시 로그인 하세요.');
  }

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/arentcar/manager/admins/refresh`, {}, { withCredentials: true });
    
    localStorage.setItem('accessToken', response.data.token);
    return response.data.token;
  } catch (error) {
    console.error("리프레시 토큰 오류:", error);
    throw error;
  }
};

//  사용자 로그아웃 처리 함수
export const handleLogout = () => {
  // localStorage.removeItem('accessToken');
  // Cookies.remove('refreshToken'); 
  window.location.href = '/'; 
};

//  사용자 로그아웃 처리 함수
export const handleAdminLogout = () => {
  // localStorage.removeItem('accessToken');
  // Cookies.remove('refreshToken'); 
  window.location.href = '/admin'; 
};
