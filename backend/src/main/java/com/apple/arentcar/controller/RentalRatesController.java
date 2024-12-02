package com.apple.arentcar.controller;

import com.apple.arentcar.dto.RentalRateResponseDTO;
import com.apple.arentcar.model.RentalRates;
import com.apple.arentcar.service.RentalRatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/arentcar")
public class RentalRatesController {

    @Autowired
    private RentalRatesService rentalRatesService;

    @GetMapping("/user/rentalRates")
    public List<RentalRates> getAllRentalRates() {
        return rentalRatesService.getAllRentalRates();
    }

    @GetMapping("/user/rentalRates/{rateCode}")
    public ResponseEntity<RentalRates> getRentalRatesById(
            @PathVariable Integer rateCode) {
        RentalRates rentalRates = rentalRatesService.getRentalRatesById(rateCode);
        if (rentalRates != null) {
            return ResponseEntity.ok(rentalRates);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/manager/rentalRates")
    public ResponseEntity<RentalRates> createRentalRates(@RequestBody RentalRates rentalRates) {
        rentalRatesService.createRentalRates(rentalRates);
        return ResponseEntity.status(HttpStatus.CREATED).body(rentalRates);
    }

    @GetMapping("/user/rentalRates/car-type/{carTypeCategory}")
    public ResponseEntity<List<RentalRateResponseDTO>> getRentalRatesByCarTypeCategory(
            @PathVariable String carTypeCategory) {
        List<RentalRateResponseDTO> rentalRates = rentalRatesService.getRentalRatesByCarTypeCategory(carTypeCategory);
        if (rentalRates != null) {
            return ResponseEntity.ok(rentalRates);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/manager/rentalRates/{rateCode}")
    public ResponseEntity<Void> updateRentalRatesById(
            @PathVariable Integer rateCode,
            @RequestBody RentalRates rentalRates) {
             rentalRates.setRateCode(rateCode);

        rentalRatesService.updateRentalRatesById(rentalRates);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/manager/rentalRates/{rateCode}")
    public ResponseEntity<Void> deleteRentalRatesById(
            @PathVariable Integer rateCode) {
        rentalRatesService.deleteRentalRatesById(rateCode);
        return ResponseEntity.noContent().build();
    }

}