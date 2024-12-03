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
    private String carTypeCategoryCode; // 수정 기능을 위해 데이터 전송
    private String originType;
    private String originTypeCode; // 수정 기능을 위해 데이터 전송
    private String carTypeName;
    private String seatingCapacity;
    private String seatingCapacityCode; // 수정 기능을 위해 데이터 전송
    private String fuelType;
    private String fuelTypeCode; // 수정 기능을 위해 데이터 전송
    private String speedLimit;
    private String speedLimitCode; // 수정 기능을 위해 데이터 전송
    private String licenseRestriction;
    private String licenseRestrictionCode; // 수정 기능을 위해 데이터 전송
    private String carManufacturer;
    private String carManufacturerCode; // 수정 기능을 위해 데이터 전송
    private String modelYear;
    private String carImageName; // 수정 기능을 위해 데이터 전송

}
