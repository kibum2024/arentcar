package com.apple.arentcar.security;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "arentcar1357!@#arentcar1357!@#"; // 비밀 키 설정
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1초(1000의1초) * 1분(60의 1초) * 60분(60분의 1분) = 1시간
    private static final long REFRESH_EXPIRATION_TIME = 7 * 24 * 60 * 60;

    // 토큰 생성
    public static String generateToken(String item) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, item);
    }

    private static String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // 리프레시 토큰 생성
    public static String generateRefreshToken(String item) {
        // UUID를 사용하여 리프레시 토큰 생성
        String refreshToken = UUID.randomUUID().toString();

        // 리프레시 토큰을 JWT로 변환
        Date now = new Date();
        Date validity = new Date(now.getTime() + REFRESH_EXPIRATION_TIME);

        return Jwts.builder()
                .setSubject(item) // 이메일을 페이로드에 포함
                .setId(refreshToken) // UUID를 토큰 ID로 사용
                .setIssuedAt(now) // 발행 시간
                .setExpiration(validity) // 만료 시간
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY) // 서명 알고리즘과 비밀키 설정
                .compact();
    }

    // 토큰 유효성 검사
    public boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
//        System.out.println("extractedUsername " + extractedUsername);

        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    // 토큰에서 사용자 이름 추출
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // 토큰이 만료되었는지 확인
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // 모든 클레임 추출
    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }

    public static boolean validateRefreshToken(String token) {
        try {
            // JWT 파서를 사용하여 토큰을 검증합니다.
            Jwts.parser()
                    .setSigningKey(SECRET_KEY) // 서명에 사용할 비밀 키 설정
                    .parseClaimsJws(token); // 토큰 검증
            return true; // 토큰이 유효함
        } catch (ExpiredJwtException e) {
            // 만료된 토큰
            System.out.println("token end");
            return false;
        } catch (JwtException e) {
            // 잘못된 토큰
            System.out.println("invalid token: " + e.getMessage());
            return false;
        }
    }

    public static String getItemFromRefreshToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject(); // 이메일을 subject로 설정했기 때문에 여기서 반환
        } catch (JwtException e) {
            // 토큰이 유효하지 않은 경우 예외 처리
            System.out.println("token item null error: " + e.getMessage());
            return null;
        }
    }
}
