package com.apple.arentcar.service;

import com.apple.arentcar.dto.ManagePaymentDTO;
import com.apple.arentcar.dto.ManagePaymentDetailDTO;
import com.apple.arentcar.dto.ManagePaymentRequestDTO;
import com.apple.arentcar.mapper.ManagePaymentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ManagePaymentService {

    @Autowired
    private ManagePaymentMapper managePaymentMapper;

    public List<ManagePaymentDTO> getAllManagePayment(ManagePaymentRequestDTO requestDTO) {
        return managePaymentMapper.getAllManagePayment(requestDTO);
    }

    public int countBySearchData(ManagePaymentRequestDTO searchRequestDTO) {
        return managePaymentMapper.countBySearchData(searchRequestDTO);
    }

    public int countAllManagePayment() {
        return managePaymentMapper.countAllManagePayment();
    }

    public ManagePaymentDetailDTO getManagePaymentDetailById(String reservationCode) {
        return managePaymentMapper.getManagePaymentDetailById(reservationCode);
    }
}
