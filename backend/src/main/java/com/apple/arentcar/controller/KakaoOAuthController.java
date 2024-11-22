package com.apple.arentcar.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/arentcar/user/callback/kakao")
public class KakaoOAuthController {

    @Value("${kakao.client.id}")
    private String clientId;

    @Value("${kakao.redirect.uri}")
    private String redirectUri;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping
    public ResponseEntity<Map<String, Object>> getKakaoToken(@RequestParam("code") String code) {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        // 액세스 토큰 요청 파라미터 설정
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // HTTP 요청 생성
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        // 카카오 API 호출
        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

        // 응답에서 액세스 토큰 추출
        String accessToken = (String) response.getBody().get("access_token");

        // JSON 형식의 응답 반환
        Map<String, Object> result = new HashMap<>();
//        result.put("access_token", accessToken);
        result.put("message", "정상적으로 로그인되었습니다.");

        return ResponseEntity.ok(result);
    }}
