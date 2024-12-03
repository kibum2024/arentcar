import React, { useEffect, useState } from 'react';
import 'user/content/ReservationDetail.css'
import NaverMap from 'user/content/NaverMap';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReservationDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const carInfoLocation = useLocation();
    const car = location.state;
    const rentalRate = car.rental_rate;
    const [insurance,setInsurance] = useState([0,0]);
    const [insuranceType,setInsuranceType] = useState('일반 자차');
    const [insuranceTypeCode,setInsuranceTypeCode] = useState('01');
    const [isMapClick, setIsMapClick] = useState(false);
    const [driverRangeFee, setDriverRangeFee] = useState('standard');
    const [discountFee, setDiscountFee] = useState(0);
    const [estimatedRentalFee, setEstimatedRentalFee] = useState(0);
    const [totalRentalFee, setTotalRentalFee] = useState(0);
    const [carInfo, setCarInfo] = useState({});
    const isLoginState = useSelector((state) => state.userState.loginState);
    const userCode = useSelector((state) => state.userState.userCode);
    

    useEffect(()=>{
        const fetchInsurance = async () => {
            try {
              const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/user/cars/insurance`, {
              });
              if (response.data) {
                setInsurance(response.data);
              }
            } catch (error) {
              if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
              } else {
                console.error('There was an error fetching the cars!', error);
              }
            }
          };
    
          fetchInsurance();
        //   console.log(car);
        //   setCarInfo({...car,user_code : userCode,payment_amount : totalRentalFee});
    },[])

    useEffect(()=>{
        setCarInfo({...car,user_code : userCode,payment_amount : totalRentalFee,insurance_type : insuranceTypeCode});
    },[userCode,totalRentalFee,insuranceTypeCode])

    useEffect(() => {
        if (car.rental_discount_rate !== 0)
            setDiscountFee(Math.floor(rentalRate / car.rental_discount_rate));
    }, [rentalRate,car.rental_discount_rate]);

    useEffect(() => {
        setEstimatedRentalFee(rentalRate - discountFee+Number( insurance[0].insurance_fee));
        setTotalRentalFee(rentalRate - discountFee+Number( insurance[0].insurance_fee));
    }, [insurance]);

    useEffect(() => {
        setInsuranceTypeCode(insuranceType === '일반 자차' ? '01':'02');
    }, [insuranceType]);

    useEffect(() => {
        if (driverRangeFee === 'everyone' && insuranceType === '일반 자차') {
            setTotalRentalFee(Number(estimatedRentalFee) + 20000);
        }
        else if(driverRangeFee === 'everyone' && insuranceType === '완전 자차'){
            setTotalRentalFee(Number(estimatedRentalFee) + 20000 +Number( insurance[1].insurance_fee)-Number( insurance[0].insurance_fee));
        }else if(driverRangeFee === 'standard' && insuranceType === '일반 자차'){
            setTotalRentalFee(Number(estimatedRentalFee));
        }else{
            setTotalRentalFee(Number(estimatedRentalFee) +Number( insurance[1].insurance_fee)-Number( insurance[0].insurance_fee));
        }
    }, [driverRangeFee,insuranceType]);

    const branchLocation = {
        branch_latitude: car.branch_latitude,
        branch_longitude: car.branch_longitude
    }
    const handleMapClick = (e) => {
        e.preventDefault();
        setIsMapClick(true);
    }
    const handleMapCloseClick = () => {
        setIsMapClick(false);
    }
    const addCommaToCurrency = (fee) => {
        if (fee.toString().length > 6) {
            return fee.toString().slice(0, -6) + ',' + fee.toString().slice(-6, -3) + ',' + fee.toString().slice(-3);
        } else if (fee.toString().length < 3) {
            return fee.toString();
        }
        return fee.toString().slice(0, -3) + ',' + fee.toString().slice(-3);
    }
    const handleDriverRange = (value) => {
        setDriverRangeFee(value);
    }
    const handleInsurancefee = (value) => {
        setInsuranceType(value);
        
    }
    const handelReservationClick = () => {
        // if(isLoginState){
            alert('결제로 이동');
            navigate('/paymentpage',{state : {...carInfo}});
        // }else{
        //     alert('로그인이 필요한 서비스 입니다.');
        //     navigate('/login',{state : {...carInfo}});
        // }
    }
    return (
        <>
            <div className='reservation-detail-wrap'>
                <div className='reservation-detail-header-wrap'>
                    <div className='reservation-detail-header-info-wrap'>
                        <div className='reservation-detail-header-info-title'>
                            <h3>{car.car_type_name}</h3>
                        </div>
                        <div className='reservation-detail-header-info-detail'>
                            <p>{car.fuel_type} {car.seating_capacity} {car.model_year}년식</p>
                            <p className='reservation-detail-header-info-map'  onClick={handleMapClick}>{car.branch_name}</p>
                        </div>
                    </div>
                </div>
                <div className='reservation-detail-side-wrap'>
                    <div className='reservation-detail-side-car-image'>
                        <img src={`${process.env.REACT_APP_IMAGE_URL}/${car.car_image_name}`} alt="차량이미지" />
                    </div>
                    <div className='reservation-detail-side-reservation-wrap'>
                        <h3>결제상세내역</h3>
                        <div className='reservation-detail-side-reservation-details'>
                            <ul>
                                <li>
                                    <span>대여료</span>
                                    <span>{addCommaToCurrency(rentalRate)}원</span>
                                </li>
                                <li>
                                    <span>운전자 범위 추가 비용</span>
                                    <span>0원</span>
                                </li>
                                <li>
                                    <span>할인금액</span>
                                    <span>{addCommaToCurrency(discountFee)}원</span>
                                </li>
                                <li>
                                    <span>계약기간</span>
                                    <span>1개월</span>
                                </li>
                            </ul>
                        </div>
                        <div className='reservation-detail-side-reservation-rental-fee'>
                            <p>총 대여료</p>
                            <p>{addCommaToCurrency(totalRentalFee)}원</p>
                        </div>
                        <button className='reservation-detail-side-reservation-button' onClick={handelReservationClick}>예약하기</button>
                    </div>
                </div>
                <div className='reservation-detail-content-wrap'>
                    <div className='reservation-detail-content-contract-information-wrap'>
                        <h3 className='reservation-detail-content-contract-information-title'>계약정보</h3>
                        <div className='reservation-detail-content-contract-information'>
                            <div>
                                <p>대여료</p>
                                <p>할인률</p>
                                <p>할인금액</p>
                            </div>
                            <div>
                                <p>{addCommaToCurrency(rentalRate)}원</p>
                                <p>{car.rental_discount_rate}%</p>
                                <p>{addCommaToCurrency(discountFee)}원</p>
                            </div>
                        </div>
                    </div>
                    <div className='reservation-detail-content-contract-information-fee'>
                        <p>예상 대여료</p>
                        <p>{addCommaToCurrency(totalRentalFee)}원</p>
                    </div>
                    <div className='reservation-detail-content-contract-information-driver-range'>
                        <div>
                            <h3>운전자 범위</h3>
                        </div>
                        <div className='reservation-detail-content-contract-information-driver-range-radio-wrap'>
                            <input
                                type="radio"
                                name="driver-range"
                                value="standard"
                                checked={driverRangeFee === 'standard'}
                                onChange={(e) => handleDriverRange(e.target.value)}
                            />
                            <label for="driver-range">표준</label>
                            <input
                                type="radio"
                                name="driver-range"
                                value="everyone"
                                checked={driverRangeFee === 'everyone'}
                                onChange={(e) => handleDriverRange(e.target.value)}
                            />
                            <label for="driver-range">누구나 <span>+20,000원</span></label>
                        </div>
                    </div>
                    <div className='reservation-detail-content-contract-information-insurance'>
                        <h3>보험</h3>
                        <div className='reservation-detail-content-contract-information-insurance-radio-wrap'>
                            <input type="radio"
                            name='insurance'
                            value="일반 자차"
                            id='insurance'
                            checked={insuranceType === '일반 자차'}
                            onChange={(e) => handleInsurancefee(e.target.value)}
                            />
                            <label for="insurance">{insurance.length>0 ? insurance[0].insurance_type : ''}</label>
                            <input type="radio"
                            name='insurance'
                            value="완전 자차"
                            id='insurance'
                            checked={insuranceType === '완전 자차'}
                            onChange={(e) => handleInsurancefee(e.target.value)}
                            />
                            <label for="insurance">{insurance.length>0 ? insurance[1].insurance_type : ''}</label>
                        </div>
                    </div>
                    <h3 className='reservation-detail-content-contract-information-note'>유의 사항</h3>
                    <div className='reservation-detail-content-contract-information-maintenance'>
                        <h3>정비 서비스</h3>
                        <ul>
                            <li>차량 법정 검사 대행</li>
                            <li>차량 사고 시 사고 처리 및 사고 수리 (고객 부담금 발생)</li>
                            <li>차량 사고/고장 시 긴급출동 서비스 (5회/년)</li>
                            <li>순회정비 차량을 이용한 정기 순회 점검</li>
                            <li>차량 사고/고장 시 긴급 대차 서비스 (8시간 이상 소요 정비/사고 수리 시 5일/년)</li>
                            <li>일반 정비 (고장 수리) 서비스</li>
                            <li>소모품 (엔진오일 등) 교환</li>
                        </ul>
                    </div>
                    <div></div>
                    <div className='reservation-detail-content-contract-information-maintenance'>
                        <h3>기타 특이사항</h3>
                        <ul>
                            <li>면허 취득일 1년 이상</li>
                            <li>신용정보에 따른 보증금, 선수금 발생할 수 있습니다.</li>
                            <li>주행거리 무제한</li>
                            <li>차량 탁송 (거리에 따른 탁송료 발생 할 수 있음)</li>
                            <li>고객 과실로 인한 파손이나 고장은 고객부담 (타이어, 휠, 7대 중과실 등 / 실내파손의 경우 고객실비 청구 예정)</li>
                            <li>보상한도 내에서 면책금 과 휴차보상료 (1일 대여요금의 50%) 임차인부담</li>
                            <li>차량 반납 시, 차량 내 오염 및 흡연으로 인한 악취 발생할 경우 실내 클리닝 비용 20만원 청구</li>
                            <li>반려동물 동반 대여 불가능</li>
                            <li>낚시 용품 지참 대여 불가능</li>
                            <li>차량 내 흡연 불가능</li>
                        </ul>
                    </div>
                    <div className='reservation-detail-content-contract-information-maintenance'>
                        <h3>중도 해지 위약금 안내</h3>
                        <ul>
                            <li>약정 기간 무관, 1달 이하 중도 해지 시 최초 한 달에 대한 대여료 환불 불가</li>
                            <li>3개월 약정 후 중도 해지 시 사용 회차 기준 대여료 총 합의 5% 위약금 발생(VAT 제외)</li>
                            <ul>최종 청구금
                                <li>약정 중도 해지 시 : 발생위약금 산식 = 일 대여료 X 잔여대여일수 X 위약율</li>
                                <li>일 대여료 : 월 대여료 X 12 ÷ 365</li>
                            </ul>
                        </ul>
                    </div>
                </div>
            </div>
            {isMapClick &&
                <NaverMap handleMapCloseClick={handleMapCloseClick} branchLocation={branchLocation} />
            }
        </>
    );
}

export default ReservationDetail;