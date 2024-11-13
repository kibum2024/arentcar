package com.apple.arentcar.mapper;
  
import com.apple.arentcar.model.Menus;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MenusMapper  {

    List<Menus> getAllMenus();

    Menus getMenusById(@Param("menuCode") Integer menuCode);

    void createMenus(Menus menus);

    void updateMenusById(Menus menus);

    void deleteMenusById(@Param("menuCode") Integer menuCode);

    

}