package com.apple.arentcar.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class RentalCars {

    private Integer carCode;
    private Integer carTypeCode;
    private String carNumber;
    private String modelYear;
    private Integer branchCode;
    private String carStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
