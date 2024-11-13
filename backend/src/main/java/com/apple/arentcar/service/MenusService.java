package com.apple.arentcar.service;

import com.apple.arentcar.model.Menus;
import com.apple.arentcar.mapper.MenusMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenusService {

    @Autowired
    private MenusMapper menusMapper;

    public List<Menus> getAllMenus() {
        return menusMapper.getAllMenus();
    }

    public Menus getMenusById(Integer menuCode) {
        return menusMapper.getMenusById(menuCode);
    }

    public void createMenus(Menus menus) {
        menusMapper.createMenus(menus);
    }

    public void updateMenusById(Menus menus) {
        menusMapper.updateMenusById(menus);
    }

    public void deleteMenusById(Integer menuCode) {
        menusMapper.deleteMenusById(menuCode);
    }

    

}