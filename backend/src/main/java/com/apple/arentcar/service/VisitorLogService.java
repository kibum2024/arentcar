package com.apple.arentcar.service;

import com.apple.arentcar.model.VisitorLog;
import com.apple.arentcar.mapper.VisitorLogMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitorLogService {

    @Autowired
    private VisitorLogMapper visitorLogMapper;

    public List<VisitorLog> getAllVisitorLog() {
        return visitorLogMapper.getAllVisitorLog();
    }

    public VisitorLog getVisitorLogById(Integer visitorLogCode) {
        return visitorLogMapper.getVisitorLogById(visitorLogCode);
    }

}