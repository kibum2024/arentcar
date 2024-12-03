package com.apple.arentcar.service;


import com.apple.arentcar.dto.*;
import com.apple.arentcar.mapper.ReservationsMapper;
import com.apple.arentcar.model.Reservations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReservationsService {
    @Autowired
    private ReservationsMapper reservationsMapper;

    public List<ReservationsResponseDTO> getReservations(ReservationsSearchRequestDTO requestDTO) {
        return reservationsMapper.getReservations(requestDTO);
    }

    public int countByConditions(ReservationsSearchRequestDTO searchRequestDTO) {
        return reservationsMapper.countByConditions(searchRequestDTO);
    }

    public int countAllReservations() {
        return reservationsMapper.countAllReservations();
    }

    public ReservationDetailDTO getReservationDetailById(String reservationCode) {
        return reservationsMapper.getReservationsDetailById(reservationCode);
    }
    public void updateCarStatus(String carNumber, Map<String, Object> carReturnRequest) {

        String carStatus = (String) carReturnRequest.get("carStatus");

        reservationsMapper.updateCarStatus(carNumber, carStatus);
    }

    public void updateReservationStatus(String reservationCode, Map<String, Object> reservationStatusRequest) {

        String reservationStatus = (String) reservationStatusRequest.get("reservationStatus");

        reservationsMapper.updateReservationStatus(reservationCode, reservationStatus);
    }

}