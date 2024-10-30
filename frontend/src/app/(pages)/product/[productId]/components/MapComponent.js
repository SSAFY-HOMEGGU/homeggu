'use client';

import React, { useState, useEffect } from 'react';

const KAKAO_MAP_API_KEY = '51fc12f90d265c8108d66e76fee0151f';

const MapComponent = ({ address }) => {
  const [map, setMap] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;
    // script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}s&autoload=false`;
    document.body.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        // 지도를 표시할 div
        const mapContainer = document.getElementById('map');

        // 지도 옵션
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        };

        // 지도를 생성합니다
        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        setMap(map);

        // 장소 검색 객체를 생성합니다
        const ps = new window.kakao.maps.services.Places();

        // 키워드로 장소를 검색합니다
        ps.keywordSearch(address, placesSearchCB);

        // 키워드 검색 완료 시 호출되는 콜백함수입니다
        function placesSearchCB(data, status, pagination) {
          if (status === window.kakao.maps.services.Status.OK) {
            // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기 위해
            // LatLngBounds 객체에 좌표를 추가합니다
            const bounds = new window.kakao.maps.LatLngBounds();
            for (let i = 0; i < data.length; i++) {
              bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x));
            }

            // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
            map.setBounds(bounds);

            // 마커를 클릭하면 장소명을 표출할 인포윈도우를 생성합니다
            const infoWindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
            setInfoWindow(infoWindow);
          }
        }

        return () => {
          // 컴포넌트 언마운트 시 지도를 제거합니다
          map.removeEventListener('click', handleMapClick);
        };
      });
    };
  }, [address]);

  return (
    <div className="w-full h-[350px]" id="map"></div>
  );
};

export default MapComponent;

