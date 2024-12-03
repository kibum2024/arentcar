package com.apple.arentcar.mapper;

import com.apple.arentcar.dto.ManagePaymentDTO;
import com.apple.arentcar.dto.ManagePaymentDetailDTO;
import com.apple.arentcar.dto.ManagePaymentRequestDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ManagePaymentMapper {

    List<ManagePaymentDTO> getAllManagePayment(ManagePaymentRequestDTO requestDTO);

    int countBySearchData(ManagePaymentRequestDTO searchRequestDTO);

    int countAllManagePayment();

    ManagePaymentDetailDTO getManagePaymentDetailById(
            @Param("reservationCode") String reservationCode);
}
