package com.apple.arentcar.model;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor   
public class RentalRates {

    private Integer rateCode;

    private Integer carTypeCode;

    private String rentalRateMainCategory;

    private String rentalRateSubCategory;

    private Integer rentalRate;

    private Integer rentalStartHours;

    private Integer rentalEndHours;

    private Integer rentalDiscountRate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}