package com.apple.arentcar.controller;

import com.apple.arentcar.dto.JwtUserResponse;
import com.apple.arentcar.dto.UsersLoginDTO;
import com.apple.arentcar.model.Users;
import com.apple.arentcar.security.JwtUtil;
import com.apple.arentcar.service.UsersService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/arentcar")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${kakao.client.id}")    
    private String clientId;

    @Value("${kakao.redirect.uri}")
    private String redirectUri;

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

    @GetMapping("/user/users/email/{userEmail}")
    public ResponseEntity<Users> getUsersByEmail(
            @PathVariable String userEmail) {
        Users users = usersService.getUsersByEmail(userEmail);
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

    @PutMapping("/user/users/issue/{userEmail}")
    public ResponseEntity<Users> updateUsersByIssue(
            @PathVariable String userEmail,
            @RequestBody Users users) {

        users = usersService.getUsersByEmail(userEmail);
        if (users == null) {
            return ResponseEntity.notFound().build();
        };

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
//            System.out.println("refresh userEmail: " + userEmail);

            // 새로운 액세스 토큰 생성
            String newAccessToken = JwtUtil.generateToken(userEmail);

            // 새로운 리프레시 토큰 생성
            String newRefreshToken = JwtUtil.generateRefreshToken(userEmail);

            // 새 리프레시 토큰을 쿠키에 저장
            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(false) // JavaScript에서 접근 불가
                    .secure(false) // HTTPS를 사용할 경우에만 전송
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

    @PostMapping("/user/naver-login")
    public ResponseEntity<?> handleNaverLogin(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String userInfoJson = fetchNaverUserInfo(token);

//        System.out.println("userInfoJson : " + userInfoJson);
        ObjectMapper objectMapper = new ObjectMapper();

        String email = "";
        try {
            JsonNode userInfo = objectMapper.readTree(userInfoJson);
            email = userInfo.get("response").get("email").asText();
//            System.out.println("이메일: " + email);
        } catch (Exception e) {
            System.out.println("사용자 정보 파싱 중 오류 발생.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원정보확인불가");
        }

        Users users = usersService.getUsersByEmail(email);
        if (users != null) {
            return ResponseEntity.ok(users);
        };

        // 사용자 정보 저장 로직
        boolean isSaved = usersService.saveNaverUser(userInfoJson);

        if (isSaved) {
            return ResponseEntity.ok(userInfoJson);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 실패");
        }
    }

    // 네이버 API 호출
    private String fetchNaverUserInfo(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken); // 토큰을 Authorization 헤더로 설정

        HttpEntity<String> entity = new HttpEntity<>(headers);
        String url = "https://openapi.naver.com/v1/nid/me"; // 네이버 사용자 정보 API URL

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return response.getBody(); // 사용자 정보 JSON 반환
    }

    @PostMapping("/user/kakao-login")
    public ResponseEntity<?> handleKakaoCallback(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

        try {
            // 액세스 토큰 요청
            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(tokenUrl, entity, Map.class);
            String accessToken = (String) tokenResponse.getBody().get("access_token");

            // 사용자 정보 요청
            String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.set("Authorization", "Bearer " + accessToken);

            HttpEntity<Void> userRequest = new HttpEntity<>(userHeaders);
            ResponseEntity<Map> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.GET, userRequest, Map.class);
            String nickname = (String) ((Map<String, Object>) userInfoResponse.getBody().get("properties")).get("nickname");

            String email = "dnflrlqja@naver.com";
            Users users = usersService.getUsersByEmail(email);
            if (users != null) {
                users.setUserName(nickname);
                return ResponseEntity.ok(users);
            };

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("user_email", "not data");
            responseBody.put("user_name", nickname);
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "로그인 실패");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}