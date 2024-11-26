package com.apple.arentcar.controller;

import com.apple.arentcar.dto.ReservationRequestDTO;
import com.apple.arentcar.dto.ReservationsResponseDTO;
import com.apple.arentcar.model.Reservations;
import com.apple.arentcar.service.ReservationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/arentcar")
public class ReservationsController {

    @Autowired
    private ReservationsService reservationsService;

//    @GetMapping("/manager/reservations")
//    public List<ReservationsResponseDTO> getAllReservations() {
//        return reservationsService.getAllReservations();
//    }

    @GetMapping("/manager/reservations")
    public ResponseEntity<List<ReservationsResponseDTO>> getAllReservations(
            @RequestParam(required = false) String userName,
            @RequestParam(required = false) String rentalLocationName,
            @RequestParam(required = false) String rentalDate) {

        // RequestDTO 생성 및 값 설정
        ReservationRequestDTO requestDTO = new ReservationRequestDTO();

        requestDTO.setUserName(userName);
        requestDTO.setRentalLocationName(rentalLocationName);
        requestDTO.setRentalDate(rentalDate);

        System.out.println("userName: " + requestDTO.getUserName());

        // Service 호출
        List<ReservationsResponseDTO> reservations = reservationsService.getAllReservations(requestDTO);

        if (reservations.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reservations);
    }

//    @GetMapping("/manager/reservations/searchlist")
//    public ResponseEntity<List<ReservationsResponseDTO>> getFilteredReservations(
//            @RequestParam(required = false) String userName,
//            @RequestParam(required = false) String rentalLocationName,
//            @RequestParam(required = false) String rentalDate) {
//
//        // RequestDTO 생성 및 값 설정
//        ReservationRequestDTO requestDTO = new ReservationRequestDTO();
//
//        requestDTO.setUserName(userName);
//        requestDTO.setRentalLocationName(rentalLocationName);
//        requestDTO.setRentalDate(rentalDate);
//
//        System.out.println("userName: " + requestDTO.getUserName());
//
//        // Service 호출
//        List<ReservationsResponseDTO> reservations = reservationsService.getFilteredReservations(requestDTO);
//
//        if (reservations.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(reservations);
//    }

    @PostMapping("/manager/reservations")
    public ResponseEntity<Reservations> createReservations(@RequestBody Reservations reservations) {
        reservationsService.createReservations(reservations);
        return ResponseEntity.status(HttpStatus.CREATED).body(reservations);
    }


    @PutMapping("/manager/reservations/{reservationCode}")
    public ResponseEntity<Void> updateReservationsById(
            @PathVariable Integer reservationCode,
            @RequestBody Reservations reservations) {
        reservations.setReservationCode(reservationCode);

        reservationsService.updateReservationsById(reservations);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/manager/reservations/{reservationCode}")
    public ResponseEntity<Void> deleteBranchsById(
            @PathVariable Integer reservationCode) {
        reservationsService.deleteReservationsById(reservationCode);
        return ResponseEntity.noContent().build();
    }



}