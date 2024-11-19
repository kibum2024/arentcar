package com.apple.arentcar.dto;

import com.apple.arentcar.model.Admins;
import com.apple.arentcar.model.Users;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtUserResponse {
    private String token; // 액세스 토큰
    private Users users; // 관리자 정보

    // 생성자: 액세스 토큰과 관리자 정보
    public JwtUserResponse(String token, Users users) {
        this.token = token;
        this.users = users;
    }
}
