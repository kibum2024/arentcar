import React, { useState, useEffect, useRef} from "react";
import axios from "axios";
import "user/content/Branches.css";


const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [branchName, setBranchName] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [branchPostCode, setBranchPostCode] = useState("");
  const [branchPhone, setBranchPhone] = useState("");
  const [branchPickup, setBranchPickup] = useState("");
  const [branchReturn, setBranchReturn] = useState("");

  const mapElement = useRef(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/user/branches`);
        if (response.data) {
          setBranches(response.data);
        }
      } catch (error) {
        console.error("There was an error fetching the branches", error);
      }
    };

    fetchBranches();
  }, []);

  const handleBranchGuideClick = async (branch) => {
    setBranchName(branch.branch_name);
    setBranchAddress(branch.branch_detailed_address);
    setBranchPostCode(branch.post_code);
    setBranchPhone(branch.branch_phone_number);
    setBranchPickup(branch.available_pickup_time);
    setBranchReturn(branch.available_return_time);
  
    const clientId = process.env.REACT_APP_NAVER_MAP_CLIENT_ID; // .env에서 가져오기
    if (!clientId) {
      console.error("Naver Map Client ID is not defined in .env file");
      return;
    }
  
    try {
      await loadNaverMapScript(clientId); // 스크립트 로드 완료 대기
      await initializeMap(branch.branch_longitude, branch.branch_latitude); // 지도 초기화
    } catch (error) {
      console.error(error.message);
    }
  };
  
  const loadNaverMapScript = (clientId) => {
    return new Promise((resolve, reject) => {
      if (window.naver && window.naver.maps) {
        resolve(); // 이미 로드된 경우 바로 resolve
      } else {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
        script.async = true;
  
        script.onload = () => resolve(); // 스크립트 로드 완료 시 resolve
        script.onerror = () => reject(new Error("Failed to load Naver Map script"));
        document.head.appendChild(script);
      }
    });
  };
  
  const initializeMap = async (lng, lat) => {
    if (!lng || !lat) {
      console.error("Longitude or Latitude is missing.");
      return;
    }

    if (mapElement.current) {
      const mapOptions = {
        center: new window.naver.maps.LatLng(lat, lng),
        zoom: 15,
      };
      const map = new window.naver.maps.Map(mapElement.current, mapOptions);
      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(lat, lng),
        map: map,
      });
    } else {
      console.error("Map element is invalid.");
    }
  };

  return (
    <div className="branches-guide-wrap flex-align-center">
      <div className="branches-guide-menu-wrap">
        {branches.map((branch, index) => (
            <div className="branches-guide-menu-item" key={index} onClick={() => handleBranchGuideClick(branch)}>
            {branch.branch_name}
            </div>
        ))}
      </div>
      <div className="branches-guide-content-wrap">
        <div className="branches-guide-map-wrap" ref={mapElement}>지점을 선택해주세요.</div>
        {branchName && (
      <div className="branches-guide-info-wrap">
        <div><strong>지점명 :</strong> {branchName}</div>
        <div><strong>주소 :</strong> {branchAddress}</div>
        <div><strong>우편번호 :</strong> {branchPostCode}</div>
        <div><strong>전화번호 :</strong> {branchPhone}</div>
        <div><strong>이용시간 :</strong> {branchPickup} ~ {branchReturn}</div>
      </div>
  )}
      </div>
    </div>
  );
};

export default Branches;
