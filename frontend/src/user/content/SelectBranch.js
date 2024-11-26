import React from 'react';
import './SelectBranch.css'

const SelectBranch = ({branchName,hendelResetBranch,hendelSelectPeriod,rentalPeriod,onClick}) => {
    
    return (
        <div className='select-branch-wrap'>
            <div className='select-branch-rental-location-wrap'>
                <span className='select-branch-rental-location-title'>대여 장소</span>
                <div className='select-branch-rental-location'>
                    <img src={`${process.env.REACT_APP_IMAGE_URL}/location_icon.svg`} alt="" />
                    <p onClick={hendelResetBranch}>{branchName === '' ? '어디에서 대여할까요?':branchName}</p>
                </div>
            </div>
            <div className='select-branch-rental-period-wrap'>
                <div className='select-branch-rental-period'>
                    <span className='select-branch-rental-location-title'>대여 기간</span>
                    <div className='select-branch-rental-location'>
                        <img src={`${process.env.REACT_APP_IMAGE_URL}/clock_icon.svg`} alt="" />
                        <p>{rentalPeriod.length > 0 ? rentalPeriod[0].getFullYear() +'-'+(rentalPeriod[0].getMonth()+1) +'-'+ rentalPeriod[0].getDate()
                        +'~'+rentalPeriod[1].getFullYear() +'-'+(rentalPeriod[1].getMonth()+1) +'-'+ rentalPeriod[1].getDate()
                        : '기간을 선택해 주세요.'}</p>
                    </div>
                </div>
                <button className='select-branch-button' onClick={hendelSelectPeriod}>검색</button>
            </div>
        </div>
    );
}

export default SelectBranch;