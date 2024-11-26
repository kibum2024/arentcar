package com.apple.arentcar.service;

import com.apple.arentcar.dto.RentalCarsDTO;
import com.apple.arentcar.mapper.RentalCarsMapper;
import com.apple.arentcar.model.RentalCars;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RentalCarsService {

    @Autowired
    private RentalCarsMapper rentalCarsMapper;

    public List<RentalCars> getAllRentalCars() { return rentalCarsMapper.getAllRentalCars(); }

    public RentalCars getRentalCarsById(Integer carCode) { return rentalCarsMapper.getRentalCarsById(carCode); }

    // 차량 등록
    public RentalCars createRentalCars(RentalCars rentalCars) {
        rentalCarsMapper.createRentalCars(rentalCars);
        return rentalCars;
    }

    // 차량 삭제
    public void deleteRentalCarsById(Integer carCode) { rentalCarsMapper.deleteRentalCarsById(carCode); }

    // 차량 수정
    public void updateRentalCarsById(RentalCars rentalCars) { rentalCarsMapper.updateRentalCarsById(rentalCars); }

    // 차량 조회 및 페이지네이션
    public List<RentalCarsDTO> getRentalCarsWithPaging(int pageSize, int pageNumber) {
        int offset = (pageNumber - 1) * pageSize;
        return rentalCarsMapper.getRentalCarsWithPaging(pageSize, offset);
    }

    // 차량 조회 및 페이지네이션(검색 기능 포함)
    public List<RentalCarsDTO> getRentalCarsByNumWithPaging(String carNumber,
                                                         int pageSize,
                                                         int pageNumber) {
        int offset = (pageNumber - 1) * pageSize;
        return rentalCarsMapper.getRentalCarsByNumWithPaging(carNumber, pageSize, offset);
    }

    // 전체 차량 수 조회
    public int countAllRentalCars() { return rentalCarsMapper.countAllRentalCars(); }

    // 전체 차량 수 조회(검색 기능 포함)
    public int countRentalCarsByNum(String carNumber) { return rentalCarsMapper.countRentalCarsByNum(carNumber); }

    // 렌탈가능/렌탈중/정비중 전체 차량 수 조회
    public int countAvailableRentalCars(String carStatus) { return rentalCarsMapper.countAvailableRentalCars(carStatus); }
}
