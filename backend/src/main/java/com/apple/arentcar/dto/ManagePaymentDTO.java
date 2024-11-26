package com.apple.arentcar.dto;

import lombok.Data;

@Data
public class ManagePaymentDTO {

    private int id;
    private String userName;
    private String branchName;
    private String carType;
    private String rentalPeriod;
    private String paymentAmount;

}
