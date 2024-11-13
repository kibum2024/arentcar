import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'manager/system/ManagerMenu.css';

const ManagerMenu = () => {
  const [menus, setMenus] = useState([]);
  const [subMenuState, setSubMenuState] = useState(false);
  const [selectedMenuMain, setSelectedMenuMain] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [mainPosition, setMainPosition] = useState({ left: 0, top: 0 });

  const handleCloseClick = () => {
    setSelectedComponent("");
  };

  const componentMap = {
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/user/menus`);
        if (response.data) {
          setMenus(response.data);
        }
      } catch (error) {
        console.error('There was an error fetching the movies!', error);
      }
    };

    fetchMenus();
  }, []);

  const handleMainMouseEnter = (menuMain, event) => {
    const rect = event.target.getBoundingClientRect();
    setMainPosition({
      left: rect.left,
      top: rect.bottom,
    });
    setSubMenuState(true);
    setSelectedMenuMain(menuMain);
  };

  const handleMainMouseLeave = () => {
    setSubMenuState(false);
    setSelectedMenuMain("");
  };

  const handleSubMenuMouseEnter = () => {
    setSubMenuState(true);
  };

  const handleSubMenuMouseLeave = () => {
    setSubMenuState(false);
    setSelectedMenuMain("");
  };

  const handleMainClick = (componentName) => {
    const component = componentMap[componentName];
    if (!component) {
      alert(`${componentName} 컴포넌트를 찾을 수 없습니다.`);
      return;
    }
    setSelectedComponent(component);
  }

  return (
    <div className='manager-menu-wrap'>
      <div className='manager-menu-header-wrap'>
        <div className='manager-menu-header-title-wrap'>
          <img className="manager-menu-header-img" src={`${process.env.REACT_APP_IMAGE_URL}/data/images/MyHelper.png`} alt="" />
          <div className='manager-menu-header-title'>MyHelper ver1.0</div>
        </div>
        <div className='manager-menu-main-header'>
          <ul>
            {menus.filter(menu => menu.menu_type === "1")
              .map((menuMain, index) => (
                <li key={index}
                  className='manager-menu-header-main-title'
                  onMouseEnter={(e) => handleMainMouseEnter(menuMain.menu_main, e)}
                  // onMouseLeave={handleMainMouseLeave}
                >
                  {menuMain.menu_name}
                </li>
              ))}
          </ul>
        </div>
        {subMenuState && (
          <div
            className='manager-menu-sub-header'
            style={{ top: `${mainPosition.top}px`, left: `${mainPosition.left}px` }}
            onMouseEnter={handleSubMenuMouseEnter}
            onMouseLeave={handleSubMenuMouseLeave}
          >
            <ul>
              {menus.filter(menuSub => menuSub.menu_type === "2" && menuSub.menu_main === selectedMenuMain)
                .map((menuSub, index) => (
                  <li key={index}
                    className='manager-menu-header-sub-title'
                    onClick={() => handleMainClick(menuSub.menu_component)}
                  >
                    {menuSub.menu_name}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
      <div className='manager-menu-container-wrap'>
        {selectedComponent && selectedComponent}
      </div>
    </div>
  );
}

export default ManagerMenu;