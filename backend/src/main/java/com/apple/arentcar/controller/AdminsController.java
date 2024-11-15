package com.apple.arentcar.controller;

import com.apple.arentcar.model.Admins;
import com.apple.arentcar.model.Menus;
import com.apple.arentcar.service.AdminsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/arentcar")
public class AdminsController {

    @Autowired
    private AdminsService adminsService;

    @GetMapping("/manager/admins")
    public List<Admins> getAllAdmins() {
        return adminsService.getAllAdmins();
    }

    @GetMapping("/manager/admins/{adminCode}")
    public ResponseEntity<Admins> getAdminsById(
            @PathVariable Integer adminCode) {
        Admins admins = adminsService.getAdminsById(adminCode);
        if (admins != null) {
            return ResponseEntity.ok(admins);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/manager/admins")
    public ResponseEntity<Admins> createAdmins(@RequestBody Admins admins) {
        Admins savedAdmins = adminsService.createAdmins(admins);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAdmins);
    }


    @PutMapping("/manager/admins/{adminCode}")
    public ResponseEntity<Void> updateAdminsById(
            @PathVariable Integer adminCode,
            @RequestBody Admins admins) {
             admins.setAdminCode(adminCode);

        adminsService.updateAdminsById(admins);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/manager/admins/{adminCode}")
    public ResponseEntity<Void> deleteAdminsById(
            @PathVariable Integer adminCode) {
        adminsService.deleteAdminsById(adminCode);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/manager/admins/paged")
    public ResponseEntity<List<Admins>> getMenusWithPaging(
            @RequestParam int pageSize,
            @RequestParam int pageNumber,
            @RequestParam(required = false) String adminName) {

        List<Admins> admins;

        if (adminName != null && !adminName.isEmpty()) {
            admins = adminsService.getAdminsByNameWithPaging(adminName, pageSize, pageNumber);
        } else {
            admins = adminsService.getAdminsWithPaging(pageSize, pageNumber);
        }

        return ResponseEntity.ok(admins);
    }

    @GetMapping("/manager/admins/count")
    public ResponseEntity<Integer> getTotalAdminsCount(@RequestParam(required = false) String menuName) {
        int count;
        if (menuName != null && !menuName.isEmpty()) {
            count = adminsService.countByNameAdmins(menuName);
        } else {
            count = adminsService.countAllAdmins();
        }
        return ResponseEntity.ok(count);
    }

}