package com.apple.arentcar.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor   
public class Users {

    private Integer userCode;

    private String userEmail;

    private String userName;

    private String userPassword;

    private String userPhoneNumber;

    private String userBirthDate;

    private String driverLicenseNumber;

    private String licenseExpiryDate;

    private String licenseIssueDate;

    private String userCategory;

    private String usageStatus;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}