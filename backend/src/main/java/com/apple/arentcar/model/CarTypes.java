package com.apple.arentcar.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class CarTypes {

    @JsonProperty("car_type_code")
    private Integer carTypeCode;
    @JsonProperty("car_type_category")
    private String carTypeCategory;
    @JsonProperty("origin_type")
    private String originType;
    @JsonProperty("car_type_name")
    private String carTypeName;
    @JsonProperty("seating_capacity")
    private String seatingCapacity;
    @JsonProperty("fuel_type")
    private String fuelType;
    @JsonProperty("speed_limit")
    private String speedLimit;
    @JsonProperty("license_restriction")
    private String licenseRestriction;
    @JsonProperty("car_manufacturer")
    private String carManufacturer;
    @JsonProperty("model_year")
    private String modelYear;
    private String carImageName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
