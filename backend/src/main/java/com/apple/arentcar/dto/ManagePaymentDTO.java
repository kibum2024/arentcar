package com.apple.arentcar.dto;

import lombok.Data;

@Data
public class ManagePaymentDTO {

    private String reservationCode;
    private String userName;
    private String branchName;
    private String carType;
    private String rentalDate;
    private String rentalPeriod;
    private String paymentAmount;

}
