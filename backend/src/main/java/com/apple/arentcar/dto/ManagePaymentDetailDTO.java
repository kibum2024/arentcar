package com.apple.arentcar.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class ManagePaymentDetailDTO {

    private String reservationCode;
    private String userName;
    private String userBirthDate;
    private String phoneNumber;
    private String userEmail;
    private String driverLicense;
    private String driverIssue;
    private String driverExpiry;
    private String branchName;
    private String carType;
    private String carNumber;
    private String rentalDate;
    private String rentalTime;
    private String returnDate;
    private String returnTime;
    private String rentalPeriod;
    private String insuranceType; //보험
    private String paymentCategoryName;
    private String paymentTypeName;
    private String paymentAmount;

}
