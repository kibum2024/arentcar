package com.apple.arentcar.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class RentalRateResponseDTO {
    private String carTypeName;
    private Integer rentalRate1;
    private Integer rentalRate2;
    private Integer rentalRate3;
    private Integer rentalRate4;
    private Integer rentalRate5;
    private Integer rentalRate6;
    private Integer rentalRate7;
}
