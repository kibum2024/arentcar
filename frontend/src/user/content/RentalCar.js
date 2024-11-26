import React, { useEffect, useState } from 'react';
import './RentalCar.css';
import axios from 'axios';

const RentalCar = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/user/cars`);
        if (response.data) {
          setCars(response.data);
        }
      } catch (error) {
        console.error('There was an error fetching the movies!', error);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className='rental-car-container'>
      {cars.map((car, index) => {
        return (
          <div className='rental-car-wrap'>
            <a href='#' key={index}>
              <div className='rental-car-title'>
                <h3>{car.car_type_name}</h3>
                <p className='rental-car-detail'>{car.fuel_type} | {car.seating_capacity} | {car.model_year}</p>
              </div>
              <img src={`${process.env.REACT_APP_IMAGE_URL}/${car.car_image_name}`} alt="Car Image" id='car-image' />
            </a>
          </div>
        );
      })}
    </div>
  );
}

export default RentalCar;
