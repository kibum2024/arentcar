import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'user/content/MainSlider.css';

const MainSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/user/sliders`);
        if (response.data) {
          setSliders(response.data);
        }
      } catch (error) {
        console.error('There was an error fetching the sliders!', error);
      }
    };

    fetchSliders();
  }, []);

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % sliders.length);
      }, 3000);
    }

    return () => clearInterval(intervalId);
  }, [isPlaying, sliders.length]);

  const handleSlidePageClick = (index) => {
    setCurrentIndex(index);
  }

  const handleSlidePlayClick = () => {
    setIsPlaying(true);
  }

  const handleSlideStopClick = () => {
    setIsPlaying(false);
  }

  const handlePrevClick = () => {
    if (currentIndex === 0) {
      setCurrentIndex(sliders.length - 1);
    } else {
      setCurrentIndex(prevIndex => (prevIndex - 1) % sliders.length);
    }
  }

  const handleNextClick = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % sliders.length);
  }

  const handleMoviePlayClick = () => {
    if (sliders && sliders.length > 0 && currentIndex >= 0) {
      let url = sliders[currentIndex].slider_url;
      console.log("url : ", url);
      setCurrentUrl(url);
      setIsModalOpen(true);
    } else {
      console.error("슬라이더 배열이 비어있거나 유효한 인덱스가 아닙니다.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUrl('');
  };

  // 드래그 시작
  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  // 드래그 중
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const diffX = startX - currentX;

    // 마우스를 왼쪽으로 드래그했을 때 이전 슬라이드로
    if (diffX > 50) {
      handleNextClick();
      setIsDragging(false); // 슬라이드가 변경되면 드래그 중지
    }

    // 마우스를 오른쪽으로 드래그했을 때 다음 슬라이드로
    if (diffX < -50) {
      handlePrevClick();
      setIsDragging(false); // 슬라이드가 변경되면 드래그 중지
    }
  };

  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="main-slider-wrap"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="main-slider-view">
        <ul>
          {sliders.map((slider, index) => (
            <li
              key={index}
              className="main-slider-view-list"
              style={{ display: index === currentIndex ? 'block' : 'none' }}
            >
              <img
                src={`${process.env.REACT_APP_IMAGE_URL}/${slider.slider_image_name}`}
                alt="slider"
                draggable="false"
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="main-slider-page">
        {sliders.map((slider, index) => {
          return (
            <div
              key={index}
              className={`main-slider-view-button ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleSlidePageClick(index)}
            ></div>
          );
        })}
        <div
          className="main-slider-play-button"
          style={{ borderLeft: isPlaying ? '11px solid green' : '11px solid #ddd' }}
          onClick={handleSlidePlayClick}
        ></div>
        <div
          className="main-slider-stop-button"
          style={{ backgroundColor: isPlaying ? '#ddd' : 'red' }}
          onClick={handleSlideStopClick}
        ></div>
      </div>
      <div className="main-slider-button">
        <div onClick={handlePrevClick}>
          <i className="bi bi-chevron-left fs-1"></i>
        </div>
        <div onClick={handleMoviePlayClick}>
          <i className="bi bi-play fs-play"></i>
        </div>
        <div onClick={handleNextClick}>
          <i className="bi bi-chevron-right fs-1"></i>
        </div>
      </div>
      {isModalOpen && (
        <div className="main-slider-modal-wrap">
          <div className="main-slider-modal-content">
            <button className="main-slider-modal-close-button" onClick={handleCloseModal}>
              닫기
            </button>
            <iframe
              src={`${currentUrl}?autoplay=1`}
              width="920"
              height="510"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSlider;
