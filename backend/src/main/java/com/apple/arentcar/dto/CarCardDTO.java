package com.apple.arentcar.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CarCardDTO {
    private Integer carTypeCode;

    private String carTypeName;

    private String fuelType;

    private String seatingCapacity;

    private String modelYear;

    private Integer carCode;

    private String carImageName;

    private String carManufacturer;

    private String branchName;

    private String brandImageName;

    private String branchLatitude;

    private String branchLongitude;

    private Integer rentalRate;

    private Integer rentalDiscountRate;
}
