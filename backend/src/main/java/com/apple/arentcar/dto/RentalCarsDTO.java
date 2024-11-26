package com.apple.arentcar.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RentalCarsDTO {

    private Integer carCode;
    private String carTypeName;
    private String carNumber;
    private String carStatus;
    private String branchName;
    private String carTypeCategory;
    private String originType;
    private String seatingCapacity;
    private String fuelType;
    private String carManufacturer;
    private String modelYear;

}
