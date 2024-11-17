package com.apple.arentcar.mapper;
  
import com.apple.arentcar.dto.AdminsLoginDTO;
import com.apple.arentcar.model.Admins;
import com.apple.arentcar.model.Menus;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminsMapper  {

    List<Admins> getAllAdmins();

    Admins getAdminsById(@Param("adminCode") Integer adminCode);

    Admins getAdminByAdminId(@Param("adminId") String adminId);

    void createAdmins(Admins admins);

    void updateAdminsById(Admins admins);

    void deleteAdminsById(@Param("adminCode") Integer adminCode);

    List<Admins> getAdminsWithPaging(@Param("pageSize") int pageSize, @Param("offset") int offset);

    List<Admins> getAdminsByNameWithPaging(@Param("menuName") String menuName, @Param("pageSize") int pageSize, @Param("offset") int offset);

    int countAllAdmins();

    int countByNameAdmins(@Param("menuName") String menuName);

    void updateAdminPasswordChange(AdminsLoginDTO requestDTO);

}