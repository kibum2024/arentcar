package com.apple.arentcar.service;

import com.apple.arentcar.dto.UsersLoginDTO;
import com.apple.arentcar.mapper.UsersMapper;
import com.apple.arentcar.model.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsersMapper usersMapper;

    @Autowired
    private EmailService emailService;

    public List<Users> getAllUsers() {
        return usersMapper.getAllUsers();
    }

    public Users getUsersById(Integer userCode) {
        return usersMapper.getUsersById(userCode);
    }

    public Users createUsers(Users users) {
        String encodedPassword = passwordEncoder.encode(users.getUserPassword());
        users.setUserPassword(encodedPassword);

        usersMapper.createUsers(users);

        return users;
    }

    public void updateUsersById(Users users) {
        usersMapper.updateUsersById(users);
    }

    public Users updateUsersByIssue(Users users) {
        String encodedPassword = passwordEncoder.encode(users.getUserPassword());
        users.setUserPassword(encodedPassword);

        usersMapper.updateUsersById(users);

        return users;
    }

    public void deleteUsersById(Integer userCode) {
        usersMapper.deleteUsersById(userCode);
    }

    public List<Users> getUsersWithPaging(int pageSize, int pageNumber) {
        int offset = (pageNumber - 1) * pageSize;
        return usersMapper.getUsersWithPaging(pageSize, offset);
    }

    public List<Users> getUsersByNameWithPaging(String menuName, int pageSize, int pageNumber) {
        int offset = (pageNumber - 1) * pageSize;
        return usersMapper.getUsersByNameWithPaging(menuName, pageSize, offset);
    }

    public int countAllUsers() {
        return usersMapper.countAllUsers();
    }

    public int countByNameUsers(String menuName) {
        return usersMapper.countByNameUsers(menuName);
    }

    public Users getUserLogin(UsersLoginDTO requestDTO) {
        return usersMapper.getUserByEmail(requestDTO.getUserEmail());
    }

    public void updateUserPasswordChange(UsersLoginDTO requestDTO) {
        String encodedPassword = passwordEncoder.encode(requestDTO.getUserPassword());
        requestDTO.setUserPassword(encodedPassword);

        usersMapper.updateUserPasswordChange(requestDTO);
    }

}