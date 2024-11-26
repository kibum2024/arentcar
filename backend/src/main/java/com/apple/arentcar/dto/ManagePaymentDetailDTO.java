package com.apple.arentcar.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ManagePaymentDetailDTO {

    private int id;
    private String userName;
    private String phoneNumber;
    private String driverLicense;
    private String branchName;
    private String carType;
    private String carNumber;
    private String rentalDate;
    private String returnDate;
    private String rentalPeriod;
    private String paymentCategory;
    private String paymentType;
    private String paymentAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
