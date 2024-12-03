package com.apple.arentcar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CarReturnRequestDTO {
    private String carNumber; // 차량 번호
    private String carStatus; // 차량 상태
}
