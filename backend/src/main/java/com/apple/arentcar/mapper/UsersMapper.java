package com.apple.arentcar.mapper;
  
import com.apple.arentcar.dto.UsersLoginDTO;
import com.apple.arentcar.model.Users;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UsersMapper {

    List<Users> getAllUsers();

    Users getUsersById(@Param("userCode") Integer userCode);

    Users getUserByEmail(@Param("userId") String userId);

    void createUsers(Users users);

    void updateUsersById(Users users);

    void deleteUsersById(@Param("userCode") Integer userCode);

    List<Users> getUsersWithPaging(@Param("pageSize") int pageSize, @Param("offset") int offset);

    List<Users> getUsersByNameWithPaging(@Param("menuName") String menuName, @Param("pageSize") int pageSize, @Param("offset") int offset);

    int countAllUsers();

    int countByNameUsers(@Param("menuName") String menuName);

    void updateUserPasswordChange(UsersLoginDTO requestDTO);

}