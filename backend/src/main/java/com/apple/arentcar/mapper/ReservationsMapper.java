package com.apple.arentcar.mapper;

import com.apple.arentcar.dto.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReservationsMapper {
    List<ReservationsResponseDTO> getReservations(ReservationsSearchRequestDTO requestDTO);
    // 조건에 따른 예약 개수 조회
    int countByConditions(ReservationsSearchRequestDTO searchRequestDTO);
    // 전체 예약 개수 조회
    int countAllReservations();

    ReservationDetailDTO getReservationsDetailById(@Param("reservationCode") String reservationCode);

    void updateCarStatus(@Param("carNumber") String carNumber, @Param("carStatus") String carStatus);

    void updateReservationStatus(@Param("reservationCode") String reservationCode, @Param("reservationStatus") String reservationStatus);
}