package com.apple.arentcar.mapper;

import com.apple.arentcar.dto.ManagePaymentDTO;
import com.apple.arentcar.dto.ManagePaymentDetailDTO;
import com.apple.arentcar.model.Menus;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ManagePaymentMapper {

    List<ManagePaymentDTO> getAllManagePayment();
//    List<ManagePaymentDTO> getManagePaymentWithPaging(@Param("pageSize") int pageSize, @Param("offset") int offset);

    List<ManagePaymentDTO> getManagePaymentWithPaging(@Param("pageSize") int pageSize, @Param("offset") int offset);

    List<ManagePaymentDTO> getMenusByNameWithPaging(@Param("menuName") String menuName, @Param("pageSize") int pageSize, @Param("offset") int offset);

    int countAllManagePayment();

    int countByManagePayment(@Param("managePayment") String managePayment);

    ManagePaymentDetailDTO getManagePaymentDetailById(@Param("id") int id);
}
