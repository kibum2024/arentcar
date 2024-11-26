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

    public List<CarCardDTO> getAllCars(String branchName, String fuelType, String carTypeCategory, String carManufacturer, String seatingCapacity) {
        return CarMapper.getAllCars(branchName,fuelType,carTypeCategory,carManufacturer,seatingCapacity);
    }

    public Integer getFilterCarsCount(String branchName, String fuelType, String carTypeCategory, String carManufacturer, String seatingCapacity) {
        return CarMapper.getFilterCarsCount(branchName,fuelType,carTypeCategory,carManufacturer,seatingCapacity);
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

    public List<BranchsDTO> getAllBranchs() {
        return CarMapper.getAllBranchs();
    }

    public List<CarTypeCategoryDTO> getCarTypeCategory() {
        return CarMapper.getCarTypeCategory();
    }
}
