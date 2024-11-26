package com.apple.arentcar.service;

import com.apple.arentcar.model.Branchs;
import com.apple.arentcar.mapper.BranchsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BranchsService {

    @Autowired
    private BranchsMapper branchsMapper;

    public List<Branchs> getAllBranchs() {
        return branchsMapper.getAllBranchs();
    }

    public Branchs getBranchsById(Integer branchCode) {
        return branchsMapper.getBranchsById(branchCode);
    }

    public void createBranchs(Branchs branchs) {
        branchsMapper.createBranchs(branchs);
    }

    public void updateBranchsById(Branchs branchs) {
        branchsMapper.updateBranchsById(branchs);
    }

    public void deleteBranchsById(Integer branchCode) {
        branchsMapper.deleteBranchsById(branchCode);
    }

    

}