package com.apple.arentcar.controller;

import com.apple.arentcar.dto.JwtUserResponse;
import com.apple.arentcar.dto.UsersLoginDTO;
import com.apple.arentcar.model.Users;
import com.apple.arentcar.security.JwtUtil;
import com.apple.arentcar.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/arentcar")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/user/users")
    public List<Users> getAllUsers() {
        return usersService.getAllUsers();
    }

    @GetMapping("/user/users/{userCode}")
    public ResponseEntity<Users> getUsersById(
            @PathVariable Integer userCode) {
        Users users = usersService.getUsersById(userCode);
        if (users != null) {
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/user/users")
    public ResponseEntity<Users> createUsers(@RequestBody Users users) {
        Users savedUsers = usersService.createUsers(users);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUsers);
    }

    @PutMapping("/user/users/{userCode}")
    public ResponseEntity<Void> updateUsersById(
            @PathVariable Integer userCode,
            @RequestBody Users users) {
        users.setUserCode(userCode);

        usersService.updateUsersById(users);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/user/users/issue/{userCode}")
    public ResponseEntity<Users> updateUsersByIssue(
            @PathVariable Integer userCode,
            @RequestBody Users users) {
        users.setUserCode(userCode);

        Users updatedUsers  = usersService.updateUsersByIssue(users);
        return ResponseEntity.ok(updatedUsers);
    }

    @DeleteMapping("/user/users/{userCode}")
    public ResponseEntity<Void> deleteUsersById(
            @PathVariable Integer userCode) {
        usersService.deleteUsersById(userCode);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/users/paged")
    public ResponseEntity<List<Users>> getUsersWithPaging(
            @RequestParam int pageSize,
            @RequestParam int pageNumber,
            @RequestParam(required = false) String userName) {

        List<Users> users;

        if (userName != null && !userName.isEmpty()) {
            users = usersService.getUsersByNameWithPaging(userName, pageSize, pageNumber);
        } else {
            users = usersService.getUsersWithPaging(pageSize, pageNumber);
        }

        return ResponseEntity.ok(users);
    }

    @GetMapping("/user/users/count")
    public ResponseEntity<Integer> getTotalUsersCount(@RequestParam(required = false) String userName) {
        int count;
        if (userName != null && !userName.isEmpty()) {
            count = usersService.countByNameUsers(userName);
        } else {
            count = usersService.countAllUsers();
        }
        return ResponseEntity.ok(count);
    }

    @PostMapping("/user/users/login")
    public ResponseEntity<?> getUserLogin(@RequestBody UsersLoginDTO requestDTO) {
        Users users = usersService.getUserLogin(requestDTO);

//        System.out.println("login admins: " + admins.getUserId());
        if (users == null) {
            return ResponseEntity.notFound().build();
        }

        boolean isPasswordMatch = passwordEncoder.matches(requestDTO.getUserPassword(), users.getUserPassword());

        if (!isPasswordMatch) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호를 확인 후 다시 로그인바랍니다.");
        }

        String token = JwtUtil.generateToken(users.getUserEmail());

        // 리프레시 토큰 생성
        String refreshToken = JwtUtil.generateRefreshToken(users.getUserEmail());

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(false) // JavaScript에서 접근 불가
                .secure(true) // HTTPS를 사용할 경우에만 전송
                .path("/") // 쿠키가 유효한 경로
                .maxAge(7 * 24 * 60 * 60) // 7일 동안 유효
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(new JwtUserResponse(token,  users));
    }

    @PostMapping("/user/users/refresh")
    public ResponseEntity<JwtUserResponse> refreshAccessToken(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
        // 리프레시 토큰이 없으면 UNAUTHORIZED 응답
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!JwtUtil.validateRefreshToken(refreshToken)) {
            // 리프레시 토큰이 만료되었거나 유효하지 않다면, 새 리프레시 토큰과 액세스 토큰을 생성
            String userEmail = JwtUtil.getItemFromRefreshToken(refreshToken);
            System.out.println("refresh userEmail: " + userEmail);

            // 새로운 액세스 토큰 생성
            String newAccessToken = JwtUtil.generateToken(userEmail);

            // 새로운 리프레시 토큰 생성
            String newRefreshToken = JwtUtil.generateRefreshToken(userEmail);

            // 새 리프레시 토큰을 쿠키에 저장
            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(false) // JavaScript에서 접근 불가
                    .secure(true) // HTTPS를 사용할 경우에만 전송
                    .path("/") // 쿠키가 유효한 경로
                    .maxAge(7 * 24 * 60 * 60) // 7일 동안 유효
                    .build();

            // 새로운 액세스 토큰과 함께 응답 반환
            return ResponseEntity.ok(new JwtUserResponse(newAccessToken, null));
        }

        // 리프레시 토큰이 유효할 경우 기존의 이메일에서 새로운 액세스 토큰 생성
        String userEmail = JwtUtil.getItemFromRefreshToken(refreshToken);
        String newAccessToken = JwtUtil.generateToken(userEmail);

        return ResponseEntity.ok(new JwtUserResponse(newAccessToken, null));
    }

    @PutMapping("/user/users/newpassword")
    public ResponseEntity<?> updateUserPasswordChange(@RequestBody UsersLoginDTO requestDTO) {
        usersService.updateUserPasswordChange(requestDTO);
        return ResponseEntity.noContent().build();
    }
}