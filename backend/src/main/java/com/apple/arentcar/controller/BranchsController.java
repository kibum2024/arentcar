package com.apple.arentcar.controller;

import com.apple.arentcar.model.Branchs;
import com.apple.arentcar.service.BranchsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/arentcar")
public class BranchsController {

    @Autowired
    private BranchsService branchsService;

    @GetMapping("/manager/branchs")
    public List<Branchs> getAllBranchs() {
        return branchsService.getAllBranchs();
    }

    @GetMapping("/manager/branchs/{branchCode}")
    public ResponseEntity<Branchs> getBranchsById(
            @PathVariable Integer branchCode) {
        Branchs branchs = branchsService.getBranchsById(branchCode);
        if (branchs != null) {
            return ResponseEntity.ok(branchs);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/manager/branchs")
    public ResponseEntity<Branchs> createBranchs(@RequestBody Branchs branchs) {
        branchsService.createBranchs(branchs);
        return ResponseEntity.status(HttpStatus.CREATED).body(branchs);
    }


    @PutMapping("/manager/branchs/{branchCode}")
    public ResponseEntity<Void> updateBranchsById(
            @PathVariable Integer branchCode,
            @RequestBody Branchs branchs) {
             branchs.setBranchCode(branchCode);

        branchsService.updateBranchsById(branchs);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/manager/branchs/{branchCode}")
    public ResponseEntity<Void> deleteBranchsById(
            @PathVariable Integer branchCode) {
        branchsService.deleteBranchsById(branchCode);
        return ResponseEntity.noContent().build();
    }



}