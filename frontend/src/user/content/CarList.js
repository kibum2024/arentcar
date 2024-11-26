import React, { useEffect, useState } from 'react';
import './CarList.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RentalCar = ({ ...selectedFilters }) => {
  const [cars, setCars] = useState([]);
  const [carsCount, setCarsCount] = useState(0);
  const navigate  = useNavigate();

  const handleCarClick = (car) => {
    navigate('/reservationdetail',{
      state: {
        ...car
      }
    });
  };

  useEffect(() => {
    const controller = new AbortController(); // 요청 취소를 위한 컨트롤러

    const fetchCars = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/user/cars`, {
          params: selectedFilters,
          signal: controller.signal, // 요청 취소 연결
        });
        if (response.data) {
          setCars(response.data);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('There was an error fetching the cars!', error);
        }
      }
    };

    const fetchCarsCount = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/user/filter/countall`, {
          params: selectedFilters,
          signal: controller.signal, // 요청 취소 연결
        });
        if (response.data || response.data === 0) {
          setCarsCount(response.data);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('There was an error fetching the cars!', error);
        }
      }
    };

    fetchCars();
    fetchCarsCount();

    return () => {
      controller.abort(); // 컴포넌트 언마운트 시 요청 취소
    };
  }, [selectedFilters]);

  return (
    <>
    <div className="car-list-wrap">
    <h3 className='car-list-title'>총 <span>{`${cars != [] ? carsCount : 0}`}</span> 건의 검색 결과가 있습니다.</h3>
      {cars.map((car, index) => (
          <div className="car-list-card-wrap" key={index} onClick={() => handleCarClick(car)}>
            <div className='car-list-card-top-area'>
            <div className="car-list-card-info">
              <img
                className="car-list-card-info-logo"
                src={`${process.env.REACT_APP_IMAGE_URL}/${car.brand_image_name}`}
                alt="로고"
              />
              <h3 className="car-list-card-info-car-name">{car.car_type_name}</h3>
            </div>
            <div className="car-list-card-car-image-wrap">
              <img
                className="car-list-card-car-image"
                src={`${process.env.REACT_APP_IMAGE_URL}/${car.car_image_name}`}
                alt="Car"
                id="car-image"
              />
            </div>
            </div>
            <div className='car-list-card-bottom-area'>
              <p>{car.fuel_type} | {car.seating_capacity} | {car.model_year}</p>
            </div>
          </div>
        ))}
    </div>
    </>
  );
};

export default RentalCar;
