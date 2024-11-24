package com.apple.arentcar.controller;

import com.apple.arentcar.model.VisitorLog;
import com.apple.arentcar.service.VisitorLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api")
public class VisitorLogController {

    @Autowired
    private VisitorLogService visitorLogService;

    @GetMapping("/manager/visitorLog")
    public List<VisitorLog> getAllVisitorLog() {
        return visitorLogService.getAllVisitorLog();
    }

    @GetMapping("/manager/visitorLog/{visitorLogCode}")
    public ResponseEntity<VisitorLog> getVisitorLogById(
            @PathVariable Integer visitorLogCode) {
        VisitorLog visitorLog = visitorLogService.getVisitorLogById(visitorLogCode);
        if (visitorLog != null) {
            return ResponseEntity.ok(visitorLog);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}