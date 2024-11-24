package com.apple.arentcar.controller;

import com.apple.arentcar.dto.AdminsLoginDTO;
import com.apple.arentcar.dto.JwtResponse;
import com.apple.arentcar.model.Admins;
import com.apple.arentcar.security.JwtUtil;
import com.apple.arentcar.service.AdminsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/arentcar")
public class AdminsController {

    @Autowired
    private AdminsService adminsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/manager/admins")
    public List<Admins> getAllAdmins() {
        return adminsService.getAllAdmins();
    }

    @GetMapping("/manager/admins/{adminCode}")
    public ResponseEntity<Admins> getAdminsById(
            @PathVariable Integer adminCode) {
        Admins admins = adminsService.getAdminsById(adminCode);
        if (admins != null) {
            return ResponseEntity.ok(admins);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/manager/admins")
    public ResponseEntity<Admins> createAdmins(@RequestBody Admins admins) {
        Admins savedAdmins = adminsService.createAdmins(admins);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAdmins);
    }

    @PutMapping("/manager/admins/{adminCode}")
    public ResponseEntity<Void> updateAdminsById(
            @PathVariable Integer adminCode,
            @RequestBody Admins admins) {
        admins.setAdminCode(adminCode);

        adminsService.updateAdminsById(admins);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/manager/admins/issue/{adminCode}")
    public ResponseEntity<Admins> updateAdminsByIssue(
            @PathVariable Integer adminCode,
            @RequestBody Admins admins) {
        admins.setAdminCode(adminCode);

        Admins updatedAdmins  = adminsService.updateAdminsByIssue(admins);
        return ResponseEntity.ok(updatedAdmins);
    }

    @DeleteMapping("/manager/admins/{adminCode}")
    public ResponseEntity<Void> deleteAdminsById(
            @PathVariable Integer adminCode) {
        adminsService.deleteAdminsById(adminCode);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/manager/admins/paged")
    public ResponseEntity<List<Admins>> getMenusWithPaging(
            @RequestParam int pageSize,
            @RequestParam int pageNumber,
            @RequestParam(required = false) String adminName) {

        List<Admins> admins;

        if (adminName != null && !adminName.isEmpty()) {
            admins = adminsService.getAdminsByNameWithPaging(adminName, pageSize, pageNumber);
        } else {
            admins = adminsService.getAdminsWithPaging(pageSize, pageNumber);
        }

        return ResponseEntity.ok(admins);
    }

    @GetMapping("/manager/admins/count")
    public ResponseEntity<Integer> getTotalAdminsCount(@RequestParam(required = false) String menuName) {
        int count;
        if (menuName != null && !menuName.isEmpty()) {
            count = adminsService.countByNameAdmins(menuName);
        } else {
            count = adminsService.countAllAdmins();
        }
        return ResponseEntity.ok(count);
    }

    @PostMapping("/manager/admins/login")
    public ResponseEntity<?> getAdminLogin(@RequestBody AdminsLoginDTO requestDTO) {
//        System.out.println("login admins: " + requestDTO.getAdminId());
        Admins admins = adminsService.getAdminLogin(requestDTO);

        if (admins == null) {
            return ResponseEntity.notFound().build();
        }

        boolean isPasswordMatch = passwordEncoder.matches(requestDTO.getAdminPassword(), admins.getAdminPassword());

        if (!isPasswordMatch) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호를 확인 후 다시 로그인바랍니다.");
        }

        String token = JwtUtil.generateToken(admins.getAdminId());

        // 리프레시 토큰 생성
        String refreshToken = JwtUtil.generateRefreshToken(admins.getAdminId());

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(false) // JavaScript에서 접근 불가
                .secure(true) // HTTPS를 사용할 경우에만 전송
                .path("/") // 쿠키가 유효한 경로
                .maxAge(7 * 24 * 60 * 60) // 7일 동안 유효
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(new JwtResponse(token,  admins));
    }

    @PostMapping("/manager/admins/refresh")
    public ResponseEntity<JwtResponse> refreshAccessToken(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
        // 리프레시 토큰이 없으면 UNAUTHORIZED 응답
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!JwtUtil.validateRefreshToken(refreshToken)) {
            // 리프레시 토큰이 만료되었거나 유효하지 않다면, 새 리프레시 토큰과 액세스 토큰을 생성
            String adminId = JwtUtil.getItemFromRefreshToken(refreshToken);
            System.out.println("refresh userEmail: " + adminId);

            // 새로운 액세스 토큰 생성
            String newAccessToken = JwtUtil.generateToken(adminId);

            // 새로운 리프레시 토큰 생성
            String newRefreshToken = JwtUtil.generateRefreshToken(adminId);

            // 새 리프레시 토큰을 쿠키에 저장
            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(false) // JavaScript에서 접근 불가
                    .secure(true) // HTTPS를 사용할 경우에만 전송
                    .path("/") // 쿠키가 유효한 경로
                    .maxAge(7 * 24 * 60 * 60) // 7일 동안 유효
                    .build();

            // 새로운 액세스 토큰과 함께 응답 반환
            return ResponseEntity.ok(new JwtResponse(newAccessToken, null));
        }

        // 리프레시 토큰이 유효할 경우 기존의 이메일에서 새로운 액세스 토큰 생성
        String adminId = JwtUtil.getItemFromRefreshToken(refreshToken);
        String newAccessToken = JwtUtil.generateToken(adminId);

        return ResponseEntity.ok(new JwtResponse(newAccessToken, null));
    }

    @PutMapping("/manager/admins/newpassword")
    public ResponseEntity<?> updateAdminPasswordChange(@RequestBody AdminsLoginDTO requestDTO) {
        adminsService.updateAdminPasswordChange(requestDTO);
        return ResponseEntity.noContent().build();
    }
}