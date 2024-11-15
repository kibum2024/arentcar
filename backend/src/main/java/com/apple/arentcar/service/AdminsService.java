package com.apple.arentcar.service;

import com.apple.arentcar.model.Admins;
import com.apple.arentcar.mapper.AdminsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminsService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AdminsMapper adminsMapper;

    public List<Admins> getAllAdmins() {
        return adminsMapper.getAllAdmins();
    }

    public Admins getAdminsById(Integer adminCode) {
        return adminsMapper.getAdminsById(adminCode);
    }

    public Admins createAdmins(Admins admins) {
        String encodedPassword = passwordEncoder.encode(admins.getAdminPassword());
        admins.setAdminPassword(encodedPassword);
        adminsMapper.createAdmins(admins);
        return admins;
    }

    public void updateAdminsById(Admins admins) {
        adminsMapper.updateAdminsById(admins);
    }

    public void deleteAdminsById(Integer adminCode) {
        adminsMapper.deleteAdminsById(adminCode);
    }

    public List<Admins> getAdminsWithPaging(int pageSize, int pageNumber) {
        int offset = (pageNumber - 1) * pageSize;
        return adminsMapper.getAdminsWithPaging(pageSize, offset);
    }

    public List<Admins> getAdminsByNameWithPaging(String menuName, int pageSize, int pageNumber) {
        int offset = (pageNumber - 1) * pageSize;
        return adminsMapper.getAdminsByNameWithPaging(menuName, pageSize, offset);
    }

    public int countAllAdmins() {
        return adminsMapper.countAllAdmins();
    }

    public int countByNameAdmins(String menuName) {
        return adminsMapper.countByNameAdmins(menuName);
    }


}