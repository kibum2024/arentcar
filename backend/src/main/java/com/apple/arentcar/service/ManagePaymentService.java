package com.apple.arentcar.service;

import com.apple.arentcar.dto.ManagePaymentDTO;
import com.apple.arentcar.dto.ManagePaymentDetailDTO;
import com.apple.arentcar.mapper.ManagePaymentMapper;
import com.apple.arentcar.model.Menus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ManagePaymentService {

    @Autowired
    private ManagePaymentMapper managePaymentMapper;

    public List<ManagePaymentDTO> getAllManagePayment() {
        return managePaymentMapper.getAllManagePayment();
    }

    public List<ManagePaymentDTO> getManagePaymentWithPaging(int pageSize, int pageNumber) {
        int offset = (pageNumber - 1) * pageSize;
        return managePaymentMapper.getManagePaymentWithPaging(pageSize, offset);
    }

    public List<ManagePaymentDTO> getMenusByNameWithPaging(String menuName, int pageSize, int pageNumber) {
        int offset = (pageNumber - 1) * pageSize;
        return managePaymentMapper.getMenusByNameWithPaging(menuName, pageSize, offset);
    }

    public int countAllManagePayment() {
        return managePaymentMapper.countAllManagePayment();
    }

    public int countByManagePayment(String managePayment) {
        return managePaymentMapper.countByManagePayment(managePayment);
    }

    public ManagePaymentDetailDTO getDetailById(int id) {
        return managePaymentMapper.getManagePaymentDetailById(id);
    }

}
