package com.apple.arentcar.security;

import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private com.apple.arentcar.security.JwtUtil jwtUtil;

    @Autowired
    private ApplicationContext applicationContext;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

//        System.out.println("authorizationHeader aaa: " + authorizationHeader);

        // 회원가입 및 토큰 발행 요청인지 확인
        String requestURI = httpRequest.getRequestURI();
        boolean isPublicRequest;
        if ("Bearer null".equals(authorizationHeader) || "Bearer undefined".equals(authorizationHeader)) {
            isPublicRequest = requestURI.equals("/arentcar/manager/admins") && httpRequest.getMethod().equalsIgnoreCase("POST")
                    || requestURI.equals("/arentcar/manager/admins/login") && httpRequest.getMethod().equalsIgnoreCase("POST")
                    || requestURI.equals("/arentcar/manager/admins/refresh") && httpRequest.getMethod().equalsIgnoreCase("POST");
        } else {
            isPublicRequest = false;
        }

//        System.out.println("isPublicRequest aaa: " + isPublicRequest);

        if (!isPublicRequest && authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (JwtException e) {
                // 토큰 검증 실패
                System.out.println("JWT false: " + e.getMessage());
                httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT 검증 실패"); // 401 에러 반환
                return; // 필터 체인에서 나가기
            }
        }

        if (username != null) {
            // JWT 검증이 성공한 경우, SecurityContext에 인증 정보 설정
            Authentication authentication = new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        chain.doFilter(request, response);
    }
}

