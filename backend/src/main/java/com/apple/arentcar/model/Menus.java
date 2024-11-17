package com.apple.arentcar.model;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor   
public class Menus {

    private Integer menuCode;

    private String menuKind;

    private String menuMain;

    private String menuSub;

    private String menuSmall;

    private String menuName;

    private String menuType;

    private String menuRole;

    private String menuIcon;

    private String menuComponent;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}