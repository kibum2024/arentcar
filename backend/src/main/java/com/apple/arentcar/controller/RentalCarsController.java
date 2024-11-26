package com.apple.arentcar.controller;

import com.apple.arentcar.dto.RentalCarsDTO;
import com.apple.arentcar.model.RentalCars;
import com.apple.arentcar.service.RentalCarsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/arentcar")
public class RentalCarsController {

    @Autowired
    private RentalCarsService rentalCarsService;

    @GetMapping("/manager/rentalcars")
    public List<RentalCars> getAllRentalCars() { return rentalCarsService.getAllRentalCars(); }

    @GetMapping("/manager/rentalcars/{carCode}")
    public ResponseEntity<RentalCars> getRentalCarsById(@PathVariable Integer carCode) {
        RentalCars rentalCars = rentalCarsService.getRentalCarsById(carCode);
        if (rentalCars != null) {
            return ResponseEntity.ok(rentalCars);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 차량 등록
    @PostMapping("/manager/rentalcars")
    public ResponseEntity<RentalCars> createRentalCars(@RequestBody RentalCars rentalCars) {
        RentalCars savedRentalCars = rentalCarsService.createRentalCars(rentalCars);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRentalCars);
    }

    // 차량 삭제
    @DeleteMapping("/manager/rentalcars/{carCode}")
    public ResponseEntity<Void> deleteRentalCars(@PathVariable Integer carCode) {
        rentalCarsService.deleteRentalCarsById((carCode));
        return ResponseEntity.noContent().build();
    }

    // 차량 수정
    @PutMapping("/manager/rentalcars/{carCode}")
    public ResponseEntity<Void> updateRentalCarsById(@PathVariable Integer carCode,
                                                     @RequestBody RentalCars rentalCars) {
        rentalCars.setCarCode(carCode);
        rentalCarsService.updateRentalCarsById(rentalCars);
        return ResponseEntity.noContent().build();
    }

    // 차량 조회 및 페이지네이션(검색 기능 포함)
    @GetMapping("/manager/rentalcars/paged")
    public ResponseEntity<List<RentalCarsDTO>>  getRentalCarsWithPaging(
                                                @RequestParam int pageSize,
                                                @RequestParam int pageNumber,
                                                @RequestParam(required = false) String carNumber) {
        List<RentalCarsDTO> rentalCars;
        if (carNumber != null && !carNumber.isEmpty()) {
            rentalCars = rentalCarsService.getRentalCarsByNumWithPaging(carNumber, pageSize, pageNumber);
        } else {
            rentalCars = rentalCarsService.getRentalCarsWithPaging(pageSize, pageNumber);
        }
        return ResponseEntity.ok(rentalCars);
    }

    // 전체 차량 수 조회(검색 기능 포함)
    @GetMapping("/manager/rentalcars/count")
    public ResponseEntity<Integer> getTotalRentalCarsCount(@RequestParam(required = false) String carNumber) {

        int count;
        if (carNumber != null && !carNumber.isEmpty()) {
            count = rentalCarsService.countRentalCarsByNum(carNumber);
        } else {
            count = rentalCarsService.countAllRentalCars();
        }
        return ResponseEntity.ok(count);
    }

    // 렌탈가능/렌탈중/정비중 전체 차량 수 조회
    @GetMapping("/manager/rentalcars/count/{carStatus}")
    public ResponseEntity<Integer> getTotalAvailableRentalCars(@PathVariable String carStatus) {
        int count = rentalCarsService.countAvailableRentalCars(carStatus);
        return ResponseEntity.ok(count);
    }
}
