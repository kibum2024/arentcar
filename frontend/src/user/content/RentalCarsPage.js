import React, { useState } from 'react';
import RentalCar from './RentalCar'
import './RentalCarsPage.css'
import Filter from './Filter';

const RentalCarsPage = ({onClick}) => {
    const[isFilter,SetIsFilter] = useState(false);

    const handleFilterClick = ()=>{
        SetIsFilter(true);
    }
    const handleFilterCloseClick = ()=>{
        SetIsFilter(false);
    }
    return (
        <div className='rental-cars-page-wrap'>
            <button className='filter' onClick={handleFilterClick}>필터</button>
            <RentalCar/>
            {isFilter && 
            <Filter handleFilterCloseClick={handleFilterCloseClick}/>
            }
        </div>
    );
}

export default RentalCarsPage;