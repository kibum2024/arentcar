package com.apple.arentcar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationsResponseDTO {
    private String reservationCode;      // 예약 코드
    private String userName;             // 사용자 이름
    private String carNumber;            // 차량 번호
    private String carTypeName;          // 차량 타입 이름
    private String rentalLocationName;   // 대여 지점 이름
    private String rentalDate;        // 대여 날짜
    private String returnDate;        // 반납 날짜
}
