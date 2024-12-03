package com.apple.arentcar.service;

import com.apple.arentcar.dto.*;
import com.apple.arentcar.mapper.CarMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {

    @Autowired
    private CarMapper CarMapper;

    public List<CarCardDTO> getAllCars(String branchName, String fuelType, String carTypeCategory, String carManufacturer, String seatingCapacity,String rentalDate,String returnDate) {
        return CarMapper.getAllCars(branchName,fuelType,carTypeCategory,carManufacturer,seatingCapacity, rentalDate,returnDate);
    }

    public Integer getFilterCarsCount(String branchName, String fuelType, String carTypeCategory, String carManufacturer, String seatingCapacity,String rentalDate,String returnDate) {
        return CarMapper.getFilterCarsCount(branchName,fuelType,carTypeCategory,carManufacturer,seatingCapacity,rentalDate,returnDate);
    }

    public List<CarTypeDTO> getCarType() {return CarMapper.getCarType();}

    public List<CarManufacturerDTO> getCarManufacturer() {
        return CarMapper.getCarManufacturer();
    }

    public List<FuelTypeDTO> getFuelType() {
        return CarMapper.getFuelType();
    }

    public List<SeatingCapacityDTO> getSeatingCapacity() {
        return CarMapper.getSeatingCapacity();
    }

    public List<ModelYearDTO> getModelYear() {
        return CarMapper.getModelYear();
    }

    public List<BranchsDTO> getAllBranchs(String region) {
        return CarMapper.getAllBranchs(region);
    }

    public List<CarTypeCategoryDTO> getCarTypeCategory() {
        return CarMapper.getCarTypeCategory();
    }

    public List<InsuranceDTO> getInsurance()  {
        return CarMapper.getInsurance();
    }


    public void InsertUserReservation(UserReservationDTO userReservationDTO) {
        int rowsInserted = CarMapper.InsertUserReservation(userReservationDTO);
        if (rowsInserted == 0) {
            throw new IllegalStateException("Reservation could not be inserted");
        }
    }

    public List<RegionsDTO> getAllRegions() {
        return CarMapper.getAllRegions();
    }
}
