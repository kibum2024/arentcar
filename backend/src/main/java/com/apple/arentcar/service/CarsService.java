package com.apple.arentcar.service;

import com.apple.arentcar.dto.CarTypesDTO;
import com.apple.arentcar.mapper.CarsMapper;
import com.apple.arentcar.model.CarTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarsService {

    @Autowired
    private CarsMapper carsMapper;

    public List<CarTypes> getAllCars() { return carsMapper.getAllCars(); }

    public CarTypes getCarsById(Integer carTypeCode)  {
        return carsMapper.getCarsById(carTypeCode);
    }

    // 차종 조회 및 페이지네이션
    public List<CarTypesDTO> getCarsWithPaging(int pageSize, int pageNumber) {
        int offset = (pageNumber - 1) * pageSize;
        return carsMapper.getCarsWithPaging(pageSize, offset);
    }

    // 차종 조회 및 페이지네이션(검색 기능 포함)
    public List<CarTypesDTO> getCarsByNameWithPaging(String carTypeName,
                                                  int pageSize,
                                                  int pageNumber) {
        int offset = (pageNumber - 1) * pageSize;
        return carsMapper.getCarsByNameWithPaging(carTypeName, pageSize, offset);
    }

    // 전체 차종 수 조회
    public int countAllCars() {
        return carsMapper.countAllCars();
    }

    // 전체 차종 수 조회(검색 기능 포함)
    public int countCarsByName(String carTypeName) {
        return carsMapper.countCarsByName(carTypeName);
    }

    // 차종 등록
    public CarTypes createCars(CarTypes carTypes) {
        carsMapper.createCars(carTypes);
        return carTypes;
    }

    // 차종 삭제
    public void deleteCarsById(Integer carTypeCode) { carsMapper.deleteCarsById(carTypeCode); }

    // 차종 수정
    public void updateCarsById(CarTypes carTypes) { carsMapper.updateCarsById(carTypes); }
}
