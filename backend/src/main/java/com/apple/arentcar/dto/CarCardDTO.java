package com.apple.arentcar.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CarCardDTO {

    private String carTypeName;

    private String fuelType;

    private String seatingCapacity;

    private String modelYear;

    private String carImageName;

    private String carManufacturer;

    private String branchName;

    private String brandImageName;

    private String branchLatitude;

    private String branchLongitude;
}
