import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");

    if (code) {
      // Spring Boot로 Authorization Code 전달
      axios
        .get(`http://localhost:8080/arentcar/user/kakao/callback?code=${code}`)
        .then((response) => {
          console.log("사용자 정보:", response.data);

          // 사용자 정보 저장 및 다음 프로세스 진행
          const userInfo = response.data;
          localStorage.setItem("user", JSON.stringify(userInfo)); // 사용자 정보 저장
          alert("로그인 성공!");

          // 메인 화면으로 이동
          navigate("/");
        })
        .catch((error) => {
          console.error("카카오 인증 실패:", error);
          alert("로그인 실패. 다시 시도해주세요.");
        });
    }
  }, [navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;
