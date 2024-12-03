package com.apple.arentcar.controller;

import com.apple.arentcar.dto.ChartDataDTO;
import com.apple.arentcar.model.Branchs;
import com.apple.arentcar.model.Menus;
import com.apple.arentcar.service.BranchsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/arentcar")
public class BranchsController {

    @Autowired
    private BranchsService branchsService;

    @GetMapping("user/branches")
    public List<Branchs> findAllBranches () {
        return branchsService.findAllBranches();
    }

    @GetMapping("/manager/branchs")
    public List<Branchs> findBranchsByBranchName(
            @RequestParam(name = "branchname") String branchName) {
        return branchsService.findBranchsByBranchName(branchName);
    }

    @GetMapping("/manager/branchs/reservation")
    public ResponseEntity<List<ChartDataDTO>> getBranchsChartData(@RequestParam String startDate, @RequestParam String endDate) {
        List<ChartDataDTO> chartDataDto = branchsService.getBranchChartData(startDate, endDate);
        return ResponseEntity.ok(chartDataDto);
    }
}
