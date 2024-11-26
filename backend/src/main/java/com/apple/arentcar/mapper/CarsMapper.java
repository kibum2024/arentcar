package com.apple.arentcar.mapper;

import com.apple.arentcar.dto.CarTypesDTO;
import com.apple.arentcar.model.CarTypes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CarsMapper {

    List<CarTypes> getAllCars();

    CarTypes getCarsById(Integer carTypeCode);

    // 차량 조회 및 페이지네이션
    List<CarTypesDTO> getCarsWithPaging(@Param("pageSize") int pageSize, @Param("offset") int offset);
    // 차량 조회 및 페이지네이션(검색 기능 포함)
    List<CarTypesDTO> getCarsByNameWithPaging(@Param("carTypeName") String carTypeName,
                                           @Param("pageSize") int pageSize,
                                           @Param("offset") int offset);
    // 전체 차종 수 조회
    int countAllCars();
    // 전체 차종 수 조회(검색 기능 포함)
    int countCarsByName(@Param("carTypeName") String carTypeName);
    // 차종 추가
    void createCars(CarTypes carTypes);
    // 차종 삭제
    void deleteCarsById(@Param("carTypeCode") Integer carTypeCode);
    // 차종 수정
    void updateCarsById(CarTypes carTypes);
}
