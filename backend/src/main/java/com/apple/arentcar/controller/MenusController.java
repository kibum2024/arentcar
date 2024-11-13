package com.apple.arentcar.controller;

import com.apple.arentcar.model.Menus;
import com.apple.arentcar.service.MenusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/arentcar")
public class MenusController {

    @Autowired
    private MenusService menusService;

    @GetMapping("/user/menus")
    public List<Menus> getAllMenus() {
        return menusService.getAllMenus();
    }

    @GetMapping("/user/menus/{menuCode}")
    public ResponseEntity<Menus> getMenusById(
            @PathVariable Integer menuCode) {
        Menus menus = menusService.getMenusById(menuCode);
        if (menus != null) {
            return ResponseEntity.ok(menus);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/manager/menus")
    public ResponseEntity<Menus> createMenus(@RequestBody Menus menus) {
        menusService.createMenus(menus);
        return ResponseEntity.status(HttpStatus.CREATED).body(menus);
    }


    @PutMapping("/manager/menus/{menuCode}")
    public ResponseEntity<Void> updateMenusById(
            @PathVariable Integer menuCode,
            @RequestBody Menus menus) {
             menus.setMenuCode(menuCode);

        menusService.updateMenusById(menus);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/manager/menus/{menuCode}")
    public ResponseEntity<Void> deleteMenusById(
            @PathVariable Integer menuCode) {
        menusService.deleteMenusById(menuCode);
        return ResponseEntity.noContent().build();
    }



}