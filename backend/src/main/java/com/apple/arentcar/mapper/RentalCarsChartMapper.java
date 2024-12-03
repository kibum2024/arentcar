package com.apple.arentcar.mapper;

import com.apple.arentcar.dto.RentalCarRankingDataDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface RentalCarsChartMapper {

    // 많이 예약된 차종 5개 조회
    List<RentalCarRankingDataDTO> getTop5ReservedCars(@Param("startDate") String startDate, @Param("endDate") String endDate);
}