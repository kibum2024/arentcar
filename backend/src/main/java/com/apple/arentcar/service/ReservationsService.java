package com.apple.arentcar.service;


import com.apple.arentcar.dto.ReservationRequestDTO;
import com.apple.arentcar.dto.ReservationsResponseDTO;
import com.apple.arentcar.mapper.ReservationsMapper;
import com.apple.arentcar.model.Reservations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ReservationsService {
    @Autowired
    private ReservationsMapper reservationsMapper;

    public List<ReservationsResponseDTO> getAllReservations(ReservationRequestDTO requestDTO) {
        return reservationsMapper.getAllReservations(requestDTO); }

//    public List<ReservationsResponseDTO> getFilteredReservations(ReservationRequestDTO requestDTO) {
//        return reservationsMapper.getFilteredReservations(requestDTO);
//    }

    public void createReservations(Reservations reservations) {
        reservationsMapper.createReservation(reservations);
    }

    public void updateReservationsById(Reservations reservations) {
        reservationsMapper.updateReservationById(reservations);
    }

    public void deleteReservationsById(Integer reservationCode) {
        reservationsMapper.deleteReservationById(reservationCode);
    }
}