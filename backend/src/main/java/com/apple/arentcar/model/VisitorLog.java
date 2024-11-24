package com.apple.arentcar.model;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor   
public class VisitorLog {

    private Integer visitorLogCode;

    private String ipAddress;

    private LocalDateTime connectTime;

}