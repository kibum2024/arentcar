package com.apple.arentcar.model;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class Sliders {

    private Integer sliderCode;

    private String sliderName;

    private String sliderPosition;

    private String sliderImageName;

    private String sliderEnable;

    private String sliderUrl;

    private LocalDateTime updatedAt;

    private LocalDateTime createdAt;

}