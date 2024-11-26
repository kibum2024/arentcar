import React, { useEffect, useRef } from 'react';
import 'user/content/NaverMap.css';

const NaverMap = ({handleMapCloseClick , branchLocation}) => {
    const mapElement = useRef(null); // 지도 표시 영역을 참조

    useEffect(() => {
        const clientId = process.env.REACT_APP_NAVER_MAP_CLIENT_ID; // .env에서 가져오기
        if (!clientId) {
            console.error("Naver Map Client ID is not defined in .env file");
            return;
        }

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
        script.async = true;
        document.head.appendChild(script);

        // 지도 초기화 및 마커 추가
        script.onload = () => {
            const mapOptions = {
                center: new window.naver.maps.LatLng(branchLocation.branch_latitude, branchLocation.branch_longitude), // 초기 중심 좌표
                zoom: 15, // 초기 줌 레벨
            };

            if (mapElement.current) {
                // 지도 객체 생성
                const map = new window.naver.maps.Map(mapElement.current, mapOptions);

                // 마커 옵션
                const markerOptions = {
                    position: new window.naver.maps.LatLng(branchLocation.branch_latitude, branchLocation.branch_longitude), // 마커 위치
                    map: map, // 마커를 추가할 지도 객체
                };

                // 마커 생성
                new window.naver.maps.Marker(markerOptions);
            }
        };

        // Cleanup when component unmounts
        return () => {
            document.head.removeChild(script);
        };
    }, []); // 컴포넌트 마운트 시 한 번 실행

    return (
        <div className='naver-map-wrap'>
            <div className='naver-map'>
                <button className='close-button' onClick={handleMapCloseClick}>
                    <img src={`${process.env.REACT_APP_IMAGE_URL}/close_btn.png`} alt="" />
                </button>
                <div
                    className='naver-map-map'
                    ref={mapElement}
                />
            </div>
        </div>
    );
};

export default NaverMap;
