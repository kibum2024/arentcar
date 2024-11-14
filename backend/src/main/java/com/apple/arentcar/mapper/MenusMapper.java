package com.apple.arentcar.mapper;

import com.apple.arentcar.model.Menus;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MenusMapper  {

    List<Menus> getAllMenus();

    Menus getMenusById(@Param("menuCode") Integer menuCode);

    List<Menus> getMenusByMenuName(@Param("menuName") String menuName);

    void createMenus(Menus menus);

    void updateMenusById(Menus menus);

    void deleteMenusById(@Param("menuCode") Integer menuCode);

    List<Menus> getMenusWithPaging(@Param("pageSize") int pageSize, @Param("offset") int offset);

    List<Menus> getMenusByNameWithPaging(@Param("menuName") String menuName, @Param("pageSize") int pageSize, @Param("offset") int offset);

    int countAllMenus();

    int countByNameMenus(@Param("menuName") String menuName);

}