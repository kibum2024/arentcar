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

    public List<Menus> getMenusByMenuName(String menuName) {
        return menusMapper.getMenusByMenuName(menuName);
    }

    public Menus createMenus(Menus menus) {
        menusMapper.createMenus(menus);
        return menus;
    }

    public void updateMenusById(Menus menus) {
        menusMapper.updateMenusById(menus);
    }

    public void deleteMenusById(Integer menuCode) {
        menusMapper.deleteMenusById(menuCode);
    }

    public List<Menus> getMenusWithPaging(int pageSize, int pageNumber) {
        int offset = (pageNumber - 1) * pageSize;
        return menusMapper.getMenusWithPaging(pageSize, offset);
    }

    public List<Menus> getMenusByNameWithPaging(String menuName, int pageSize, int pageNumber) {
        int offset = (pageNumber - 1) * pageSize;
        return menusMapper.getMenusByNameWithPaging(menuName, pageSize, offset);
    }

    public int countAllMenus() {
        return menusMapper.countAllMenus();
    }

    public int countByNameMenus(String menuName) {
        return menusMapper.countByNameMenus(menuName);
    }

}