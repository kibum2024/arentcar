package com.apple.arentcar.service;

import com.apple.arentcar.dto.AdminsLoginDTO;
import com.apple.arentcar.model.Admins;
import com.apple.arentcar.mapper.AdminsMapper;
import com.apple.arentcar.util.PasswordGenerator;
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

    @Autowired
    private EmailService emailService;

    public List<Admins> getAllAdmins() {
        return adminsMapper.getAllAdmins();
    }

    public Admins getAdminsById(Integer adminCode) {
        return adminsMapper.getAdminsById(adminCode);
    }

    public Admins createAdmins(Admins admins) {
        String temporaryPassword = PasswordGenerator.generateTemporaryPassword();
        admins.setAdminPassword(temporaryPassword);

        String encodedPassword = passwordEncoder.encode(temporaryPassword);
        admins.setAdminPassword(encodedPassword);

        adminsMapper.createAdmins(admins);

        String emailSubject = "A렌트카 관리자로 가입되었습니다.";
        String emailBody = String.format(
                "안녕하세요. %s님,\n\n A렌트카 사용자관리자로 가입되었습니다.\n\n임시비밀번호 : %s\n\n 비밀번호 변경 후 로그인 바랍니다.\n\n감사합니다.",
                admins.getAdminName(),
                temporaryPassword
        );
        emailService.sendEmail(admins.getAdminEmail(), emailSubject, emailBody);

        return admins;
    }

    public void updateAdminsById(Admins admins) {
        adminsMapper.updateAdminsById(admins);
    }

    public Admins updateAdminsByIssue(Admins admins) {
        String temporaryPassword = PasswordGenerator.generateTemporaryPassword();
        admins.setAdminPassword(temporaryPassword);

        String encodedPassword = passwordEncoder.encode(temporaryPassword);
        admins.setAdminPassword(encodedPassword);

        adminsMapper.updateAdminsById(admins);

        String emailSubject = "A렌트카 관리자 임시비밀번호가 발급되었습니다.";
        String emailBody = String.format(
                "안녕하세요. %s님,\n\n A렌트카 관리자 임시비밀번호가 발급되었습니다.\n\n임시비밀번호 : %s\n\n 비밀번호 변경 후 로그인 바랍니다.\n\n감사합니다.",
                admins.getAdminName(),
                temporaryPassword
        );
        emailService.sendEmail(admins.getAdminEmail(), emailSubject, emailBody);

        return admins;
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

    // 관리자 로그인
    public Admins getAdminLogin(AdminsLoginDTO requestDTO) {
        return adminsMapper.getAdminByAdminId(requestDTO.getAdminId());
    }

    public void updateAdminPasswordChange(AdminsLoginDTO requestDTO) {
        String encodedPassword = passwordEncoder.encode(requestDTO.getAdminPassword());
        requestDTO.setAdminPassword(encodedPassword);

        adminsMapper.updateAdminPasswordChange(requestDTO);
    }


}