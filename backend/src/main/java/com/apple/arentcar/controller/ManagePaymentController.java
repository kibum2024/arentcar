package com.apple.arentcar.controller;

import com.apple.arentcar.dto.ManagePaymentDTO;
import com.apple.arentcar.dto.ManagePaymentDetailDTO;
import com.apple.arentcar.dto.ManagePaymentRequestDTO;
import com.apple.arentcar.service.ManagePaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/arentcar")
public class ManagePaymentController {

    @Autowired
    private ManagePaymentService managePaymentService;

    @GetMapping("/manager/rentalrates")
    public ResponseEntity<List<ManagePaymentDTO>> getAllManagePayment(
            @RequestParam(required = false) String userName,
            @RequestParam(required = false) String branchName,
            @RequestParam(required = false) String rentalDate,
            @RequestParam(defaultValue = "1") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {

        pageNumber = Math.max(pageNumber, 1);
        int offset = (pageNumber -1) * pageSize;

        ManagePaymentRequestDTO requestDTO = new ManagePaymentRequestDTO();
        requestDTO.setUserName(userName);
        requestDTO.setBranchName(branchName);
        requestDTO.setRentalDate(rentalDate);
        requestDTO.setPageSize(pageSize);
        requestDTO.setOffset(offset);

        List<ManagePaymentDTO> managePayment = managePaymentService.getAllManagePayment(requestDTO);
         if (managePayment.isEmpty()) {
             return ResponseEntity.notFound().build();
         }
        return ResponseEntity.ok(managePayment);
    }

    @GetMapping("/manager/rentalrates/count")
    public  ResponseEntity<Integer> getTotalManagePaymentCount(
            @RequestParam(required = false) String userName,
            @RequestParam(required = false) String branchName,
            @RequestParam(required = false) String rentalDate) {

        int count;

        if ((userName != null && !userName.isEmpty()) ||
            (branchName != null && !branchName.isEmpty()) ||
            (rentalDate != null && !rentalDate.isEmpty())) {

            ManagePaymentRequestDTO searchRequestDTO = new ManagePaymentRequestDTO();

            searchRequestDTO.setUserName(userName);
            searchRequestDTO.setBranchName(branchName);
            searchRequestDTO.setRentalDate(rentalDate);

            count = managePaymentService.countBySearchData(searchRequestDTO);
        } else {
            count = managePaymentService.countAllManagePayment();
        }
        return ResponseEntity.ok(count);
    }

    @GetMapping("/manager/rentalrates/detail/{reservationCode}")
    public ManagePaymentDetailDTO getManagePaymentDetailById(
            @PathVariable("reservationCode") String reservationCode) {
        return managePaymentService.getManagePaymentDetailById(reservationCode);
    }
}
