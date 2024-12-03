package com.apple.arentcar.service;

import com.apple.arentcar.dto.ChartDataDTO;
import com.apple.arentcar.mapper.BranchsMapper;
import com.apple.arentcar.model.Branchs;
import com.apple.arentcar.model.Menus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
public class BranchsService {

    @Autowired
    private BranchsMapper branchsMapper;

    public List<Branchs> findAllBranches() {
        return branchsMapper.findAllBranches();
    }

    public List<Branchs> findBranchsByBranchName(String branchName) {
        return branchsMapper.findBranchsByBranchName(branchName);
    }

    public List<ChartDataDTO> getBranchChartData(String startDate, String endDate) {
        return branchsMapper.getBranchChartData(startDate, endDate);
    }
}