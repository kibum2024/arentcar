import axios from 'axios';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentPage = () => {
    const location = useLocation();
    const reservationInfo = location.state;
    const params = {
        userCode : reservationInfo.user_code,
        carCode : reservationInfo.car_code,
        rentalLocation : reservationInfo.branch_name,
        rentalDate : reservationInfo.rental_date,
        rentalTime : '0800',
        returnLocation : reservationInfo.branch_name,
        returnDate : reservationInfo.return_date,
        returnTime : '0900',
        insuranceType : reservationInfo.insurance_type,
        paymentCategory : '1',
        paymentType : '01',
        paymentAmount : reservationInfo.payment_amount
    }

        const InsertUserReservation = async () => {

            try {
                console.log(params);
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/arentcar/user/cars/reservation`,
                    null,
                    {params : params}
                    
                );
              if (response.status === 200) {
                alert('예약 성공');
              }
            } catch (error) {
              if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
              } else {
                console.error('There was an error fetching the cars!', error);
              }
            }
          };

    return (
        <div>
            <button onClick={() => InsertUserReservation()}>결제하기</button>
        </div>
    );
}

export default PaymentPage;