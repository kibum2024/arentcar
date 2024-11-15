package com.apple.arentcar.controller;

import com.apple.arentcar.model.Admins;
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

    @GetMapping("/manager/menus")
    public List<Menus> getAllMenus() {
        return menusService.getAllMenus();
    }

    @GetMapping("/manager/menus/{menuCode}")
    public ResponseEntity<Menus> getMenusById(
            @PathVariable Integer menuCode) {
        Menus menus = menusService.getMenusById(menuCode);
        if (menus != null) {
            return ResponseEntity.ok(menus);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/manager/menus/name/{menuName}")
    public List<Menus> getMenusByMenuName(
            @PathVariable String menuName) {
        return menusService.getMenusByMenuName(menuName);
    }

    @PostMapping("/manager/menus")
    public ResponseEntity<Menus> createMenus(@RequestBody Menus menus) {
        Menus savedMenus = menusService.createMenus(menus);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMenus);
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

    @GetMapping("/manager/menus/paged")
    public ResponseEntity<List<Menus>> getMenusWithPaging(
            @RequestParam int pageSize,
            @RequestParam int pageNumber,
            @RequestParam(required = false) String menuName) {

        List<Menus> menus;

        if (menuName != null && !menuName.isEmpty()) {
            menus = menusService.getMenusByNameWithPaging(menuName, pageSize, pageNumber);
        } else {
            menus = menusService.getMenusWithPaging(pageSize, pageNumber);
        }

        return ResponseEntity.ok(menus);
    }

    @GetMapping("/manager/menus/count")
    public ResponseEntity<Integer> getTotalMenusCount(@RequestParam(required = false) String menuName) {
        int count;
        if (menuName != null && !menuName.isEmpty()) {
            count = menusService.countByNameMenus(menuName);
        } else {
            count = menusService.countAllMenus();
        }
        return ResponseEntity.ok(count);
    }

}