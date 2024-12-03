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
    private String carTypeCode; // 수정 기능을 위해 데이터 전송
    private String carNumber;
    private String carStatus;
    private String carStatusCode; // 수정 기능을 위해 데이터 전송
    private String branchName;
    private String branchCode; // 수정 기능을 위해 데이터 전송
    private String carTypeCategory;
    private String originType;
    private String seatingCapacity;
    private String fuelType;
    private String carManufacturer;
    private String modelYear;

}
