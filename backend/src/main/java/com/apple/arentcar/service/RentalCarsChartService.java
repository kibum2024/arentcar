package com.apple.arentcar.service;

import com.apple.arentcar.dto.RentalCarRankingDataDTO;
import com.apple.arentcar.mapper.RentalCarsChartMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RentalCarsChartService {

    @Autowired
    private RentalCarsChartMapper rentalCarsChartMapper;

    public List<RentalCarRankingDataDTO> getTop5ReservedCars(String startDate, String endDate) {
        return rentalCarsChartMapper.getTop5ReservedCars(startDate, endDate);
    }
}