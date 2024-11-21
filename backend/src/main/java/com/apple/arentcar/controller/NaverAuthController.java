package com.apple.arentcar.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@RestController
public class NaverAuthController {

    @Value("${naver.client.id}")
    private String clientId;

    @Value("${naver.client.secret}")
    private String clientSecret;

    @Value("${naver.redirect.uri}")
    private String redirectUri;

    private final RestTemplate restTemplate;

    public NaverAuthController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // 네이버 로그인 페이지로 리디렉션
    @GetMapping("/arentcar/user/naver")
    public ResponseEntity<String> redirectToNaver(HttpSession session) {
        String state = UUID.randomUUID().toString(); // 무작위 상태값 생성
        session.setAttribute("state", state); // 세션에 상태값 저장

        String naverAuthUrl = "https://nid.naver.com/oauth2.0/authorize"
                + "?response_type=code"
                + "&client_id=" + clientId
                + "&redirect_uri=" + redirectUri
                + "&state=" + state;

        return ResponseEntity.status(302).header(HttpHeaders.LOCATION, naverAuthUrl).build();
    }

    // 네이버 로그인 후 받은 인증 코드를 처리
    @GetMapping("/arentcar/user/naver/callback")
    public String naverLoginCallback(
            @RequestParam("code") String code,
            @RequestParam("state") String state,
            HttpSession session) {

        String sessionState = (String) session.getAttribute("state");
        if (!state.equals(sessionState)) {
            throw new IllegalArgumentException("Invalid state parameter");
        }

        System.out.println("네이버 로그인 인증 코드: " + code);
        System.out.println("네이버 로그인 상태값: " + state);

        String url = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code"
                + "&client_id=" + clientId
                + "&client_secret=" + clientSecret
                + "&code=" + code
                + "&state=" + state;

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }

}
