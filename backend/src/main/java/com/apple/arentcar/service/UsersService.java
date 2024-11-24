package com.apple.arentcar.service;

import com.apple.arentcar.dto.UsersLoginDTO;
import com.apple.arentcar.mapper.UsersMapper;
import com.apple.arentcar.model.Users;
import com.apple.arentcar.util.PasswordGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    public Users getUsersByEmail(String userEmail) {
        return usersMapper.getUsersByEmail(userEmail);
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
        String temporaryPassword = PasswordGenerator.generateTemporaryPassword();
        users.setUserPassword(temporaryPassword);

        String encodedPassword = passwordEncoder.encode(temporaryPassword);
        users.setUserPassword(encodedPassword);
        users.setUsageStatus("3");

        usersMapper.updateUsersById(users);

        String emailSubject = "A렌트카 임시비밀번호가 발급되었습니다.";
        String emailBody = String.format(
                "안녕하세요. %s님,\n\n A렌트카 사용자 임시비밀번호가 발급되었습니다.\n\n임시비밀번호 : %s\n\n 비밀번호 변경 후 로그인 바랍니다.\n\n감사합니다.",
                users.getUserName(),
                temporaryPassword
        );
        emailService.sendEmail(users.getUserEmail(), emailSubject, emailBody);

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
        return usersMapper.getUsersByEmail(requestDTO.getUserEmail());
    }

    public void updateUserPasswordChange(UsersLoginDTO requestDTO) {
        String encodedPassword = passwordEncoder.encode(requestDTO.getUserPassword());
        requestDTO.setUserPassword(encodedPassword);

        usersMapper.updateUserPasswordChange(requestDTO);
    }

    public boolean saveNaverUser(String userInfoJson) {
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            // JSON에서 필요한 데이터 추출
            JsonNode userInfo = objectMapper.readTree(userInfoJson);
            String id = userInfo.get("response").get("id").asText();
            String email = userInfo.get("response").get("email").asText();
            String name = userInfo.get("response").get("name").asText();
            String mobile = userInfo.get("response").get("mobile").asText().replace("-", "");
            String birthday = userInfo.get("response").get("birthday").asText().replace("-", "");;
            String birthyear = userInfo.get("response").get("birthyear").asText();

            // 사용자 엔티티 생성 및 저장
            Users users = new Users();
            users.setUserEmail(email);
            users.setUserName(name);
            users.setUserPassword("naver");
            users.setUserPhoneNumber(mobile);
            users.setUserBirthDate(birthyear + birthday);
            users.setUserCategory("1");
            users.setUsageStatus("1");

//            System.out.println("users.setUserBirthDate : " + users.getUserBirthDate());

            usersMapper.createUsers(users);
            return true;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return false;
        }
    }

}