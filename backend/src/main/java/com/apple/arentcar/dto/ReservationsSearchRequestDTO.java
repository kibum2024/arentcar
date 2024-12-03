package com.apple.arentcar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationsSearchRequestDTO {
    private String userName;
    private String rentalLocationName;
    private String rentalDate;
    private int offset;
    private int pageSize;
}
