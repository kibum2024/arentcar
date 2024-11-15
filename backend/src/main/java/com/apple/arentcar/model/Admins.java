package com.apple.arentcar.model;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor   
public class Admins {

    private Integer adminCode;

    private String adminId;

    private String adminPassword;

    private String adminName;

    private String adminRole;

    private String adminEmail;

    private String usageStatus;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}