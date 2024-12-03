package com.apple.arentcar.controller;

import com.apple.arentcar.dto.*;
import com.apple.arentcar.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/arentcar")
public class CarController {

    @Autowired
    private CarService carService;

    @GetMapping("/user/cars")
    public List<CarCardDTO> getAllCars(
            @RequestParam(name = "branchName",required = false, defaultValue = "수원 본점") String branchName,
            @RequestParam(name = "fuelType",required = false) String fuelType,
            @RequestParam(name = "carTypeCategory",required = false) String carTypeCategory,
            @RequestParam(name = "carManufacturer",required = false) String carManufacturer,
            @RequestParam(name = "seatingCapacity",required = false) String seatingCapacity,
            @RequestParam(name = "rentalDate",required = false) String rentalDate,
            @RequestParam(name = "returnDate",required = false) String returnDate
    ) {
        return carService.getAllCars(branchName,fuelType,carTypeCategory,carManufacturer,seatingCapacity, rentalDate,returnDate);
    }

    @GetMapping("/user/cars/filter/countall")
    public Integer getFilterCarsCount(
            @RequestParam(name = "branchName",required = false, defaultValue = "수원 본점") String branchName,
            @RequestParam(name = "fuelType",required = false) String fuelType,
            @RequestParam(name = "carTypeCategory",required = false) String carTypeCategory,
            @RequestParam(name = "carManufacturer",required = false) String carManufacturer,
            @RequestParam(name = "seatingCapacity",required = false) String seatingCapacity,
            @RequestParam(name = "rentalDate",required = false) String rentalDate,
            @RequestParam(name = "returnDate",required = false) String returnDate
    ) {
        return carService.getFilterCarsCount(branchName,fuelType,carTypeCategory,carManufacturer, seatingCapacity,rentalDate,returnDate);
    }

    @GetMapping("/user/cars/filter/cartype")
    public List<CarTypeDTO> getCarType() {
        return carService.getCarType();
    }

    @GetMapping("/user/cars/filter/carmanufacturer")
    public List<CarManufacturerDTO> getCarManufacturer() {
        return carService.getCarManufacturer();
    }

    @GetMapping("/user/cars/filter/fueltype")
    public List<FuelTypeDTO> getFuelType() {
        return carService.getFuelType();
    }

    @GetMapping("/user/cars/filter/seatingcapacity")
    public List<SeatingCapacityDTO> getSeatingCapacity() {
        return carService.getSeatingCapacity();
    }

    @GetMapping("/user/cars/filter/modelyear")
    public List<ModelYearDTO> getModelYear() {
        return carService.getModelYear();
    }

    @GetMapping("/user/cars/filter/cartypecategory")
    public List<CarTypeCategoryDTO> getCarTypeCategory() {
        return carService.getCarTypeCategory();
    }

    @GetMapping("/user/cars/branchs")
    public List<BranchsDTO> getAllBranchs(@RequestParam(name = "region") String region) {
        return carService.getAllBranchs(region);
    }

    @GetMapping("/user/cars/regions")
    public List<RegionsDTO> getAllRegions() {
        return carService.getAllRegions();
    }
    @GetMapping("/user/cars/insurance")
        public List<InsuranceDTO> getInsurance() { return carService.getInsurance(); }

    @PostMapping("/user/cars/reservation")
    public ResponseEntity<Void> InsertUserReservation(
            @RequestParam (name = "userCode") Integer userCode,
            @RequestParam (name = "carCode") Integer carCode,
            @RequestParam (name = "rentalLocation") String rentalLocation,
            @RequestParam (name = "rentalDate") String rentalDate,
            @RequestParam (name = "rentalTime") String rentalTime,
            @RequestParam (name = "returnLocation") String returnLocation,
            @RequestParam (name = "returnDate") String returnDate,
            @RequestParam (name = "returnTime") String returnTime,
            @RequestParam (name = "insuranceType") String insuranceType,
            @RequestParam (name = "paymentCategory") String paymentCategory,
            @RequestParam (name = "paymentType") String paymentType,
            @RequestParam (name = "paymentAmount") Integer paymentAmount
    ) {
        UserReservationDTO userReservationDTO = new UserReservationDTO(userCode,carCode,rentalLocation,rentalDate,rentalTime,returnLocation,returnDate,returnTime,insuranceType,paymentCategory,paymentType,paymentAmount);
        carService.InsertUserReservation(userReservationDTO);
        return ResponseEntity.ok(null);
    }

}
