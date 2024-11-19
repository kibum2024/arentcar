import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setAdminState } from '../../redux/AdminState';
import { refreshAccessToken, handleLogout } from 'common/Common';
import 'manager/system/ManagerMenu.css';
import RegisterMenu from 'manager/system/RegisterMenu';
import RegisterUser from 'manager/system/RegisterUser';

const ManagerMenu = () => {
  const [menus, setMenus] = useState([]);
  const [subMenuState, setSubMenuState] = useState(false);
  const [subMenuMoveState, setSubMenuMoveState] = useState(false);
  const [selectedMenuMain, setSelectedMenuMain] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [mainPosition, setMainPosition] = useState({ left: 0, top: 0 });
  const isAdminRole = useSelector((state) => state.adminState.adminRole);
  const isAdminName = useSelector((state) => state.adminState.adminName);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCloseClick = () => {
    setSelectedComponent("");
  };

  const componentMap = {
    RegisterMenu: <RegisterMenu onClick={handleCloseClick} />,
    RegisterUser: <RegisterUser onClick={handleCloseClick} />,
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        await getMenus(token);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await getMenus(newToken);
          } catch (refreshError) {
            alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
            handleLogout();
          }
        } else {
          console.error('There was an error fetching the menu!', error);
        }
      }
    };

    fetchMenus();
  }, []);

  const getMenus = async (token) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/menus`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true, 
    });
    setMenus(response.data);
  };


  const handleMainMouseEnter = (menuMain, event) => {
    const rect = event.target.getBoundingClientRect();
    setMainPosition({
      left: rect.left,
      top: rect.bottom,
    });
    setSubMenuState(true);
    setSubMenuMoveState(false);
    setSelectedMenuMain(menuMain);
  };

  const handleMainMouseLeave = () => {
    if (!subMenuMoveState) {
      setSubMenuState(false);
      setSubMenuMoveState(false);
    }
  };

  const handleSubMenuMouseEnter = () => {
    setSubMenuState(true);
    setSubMenuMoveState(true);
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

  const handleMenuCloseClick = () => {
    dispatch(setAdminState({
      loginState: false
    }));
    handleLogout()
  }

  const handleHomePageClick = () => {
    navigate('/');
  }

  return (
    <div className='manager-menu-wrap'>
      <div className='manager-menu-header-wrap'>
        <div className='manager-menu-main-header'>
          <div className="manager-menu-header-img-wrap">
            <img className="manager-menu-header-img" src={`${process.env.REACT_APP_IMAGE_URL}/arentcar.png`} alt="" />
          </div>
          <ul>
            {menus.filter(menu => menu.menu_kind === "2" && menu.menu_type === "1" && menu.menu_role >= isAdminRole)
              .map((menuMain, index) => (
                <li key={index}
                  className='manager-menu-header-main-title'
                  onMouseEnter={(e) => handleMainMouseEnter(menuMain.menu_main, e)}
                  onMouseLeave={handleMainMouseLeave}
                >
                  {menuMain.menu_name}
                </li>
              ))}
          </ul>
        </div>
        <div className='manager-menu-main-header-login-info'>
          <div>{isAdminName}님</div>
          <div className='manager-menu-main-header-login-out' onClick={handleMenuCloseClick}>로그아웃</div>
        </div>
        {subMenuState && (
          <div
            className='manager-menu-sub-header'
            style={{ top: `${mainPosition.top}px`, left: `${mainPosition.left}px` }}
          >
            <ul 
              onMouseEnter={handleSubMenuMouseEnter}
              onMouseLeave={handleSubMenuMouseLeave}
            >
              {menus.filter(menuSub => menuSub.menu_kind === "2" && menuSub.menu_type === "2" && menuSub.menu_main === selectedMenuMain && menuSub.menu_role >= isAdminRole)
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
      <div className='manager-menu-content-wrap'>
        <div className='manager-menu-content-left'>
          <div className='manager-menu-content-homepage' onClick={handleHomePageClick}>
            홈페이지
          </div>
        </div>
        <div className='manager-menu-content-right'>
          <div className='manager-menu-content-right-top'>
            관리자모드
          </div>
          <div>
            {selectedComponent && selectedComponent}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerMenu;