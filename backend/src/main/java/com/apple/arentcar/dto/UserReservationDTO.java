package com.apple.arentcar.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserReservationDTO {
    private Integer userCode;
    private Integer carCode;
    private String rentalLocation;
    private String rentalDate;
    private String rentalTime;
    private String returnLocation;
    private String returnDate;
    private String returnTime;
    private String insuranceType;
    private String paymentCategory;
    private String paymentType;
    private Integer paymentAmount;
}
