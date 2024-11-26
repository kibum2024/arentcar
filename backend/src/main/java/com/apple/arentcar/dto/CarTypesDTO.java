package com.apple.arentcar.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CarTypesDTO {

    private Integer carTypeCode;
    private String carTypeCategory;
    private String originType;
    private String carTypeName;
    private String seatingCapacity;
    private String fuelType;
    private String speedLimit;
    private String licenseRestriction;
    private String carManufacturer;
    private String modelYear;

}
