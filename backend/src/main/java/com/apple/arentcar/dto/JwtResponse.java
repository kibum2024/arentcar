package com.apple.arentcar.dto;

import com.apple.arentcar.model.Admins;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtResponse {
    private String token; // 액세스 토큰
    private Admins admins; // 관리자 정보

    // 생성자: 액세스 토큰과 관리자 정보
    public JwtResponse(String token, Admins admins) {
        this.token = token;
        this.admins = admins;
    }
}
