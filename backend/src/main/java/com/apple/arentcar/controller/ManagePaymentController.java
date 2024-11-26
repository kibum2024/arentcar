package com.apple.arentcar.controller;

import com.apple.arentcar.dto.ManagePaymentDTO;
import com.apple.arentcar.dto.ManagePaymentDetailDTO;
import com.apple.arentcar.model.Menus;
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
    public List<ManagePaymentDTO> getAllManagePayment() {
        return managePaymentService.getAllManagePayment();
    }

    @GetMapping("/manager/rentalrates/paged")
    public ResponseEntity<List<ManagePaymentDTO>> getManagePaymentWithPaging(
            @RequestParam int pageSize,
            @RequestParam int pageNumber,
            @RequestParam(required = false) String managePayment) {

        List<ManagePaymentDTO> managePaymentDTOS;

        if (managePayment != null && !managePayment.isEmpty()) {
            managePaymentDTOS = managePaymentService.getMenusByNameWithPaging(managePayment, pageSize, pageNumber);
        } else {
            managePaymentDTOS = managePaymentService.getManagePaymentWithPaging(pageSize, pageNumber);
        }

        return ResponseEntity.ok(managePaymentDTOS);
    }

    @GetMapping("/manager/rentalrates/count")
    public ResponseEntity<Integer> getTotalManagePaymentCount(@RequestParam(required = false) String managePayment) {
        int count;
        if (managePayment != null && !managePayment.isEmpty()) {
            count = managePaymentService.countByManagePayment(managePayment);
        } else {
            count = managePaymentService.countAllManagePayment();
        }
        return ResponseEntity.ok(count);
    }

    @GetMapping("/manager/rentalrates/{id}")
    public ResponseEntity<?> getDetailById(@PathVariable("id") int id) {
        ManagePaymentDetailDTO detail = managePaymentService.getDetailById(id);
        if (detail != null) {
            return ResponseEntity.ok(detail);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
