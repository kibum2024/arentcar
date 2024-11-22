import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUserState } from '../../redux/UserState';
import axios from 'axios';
import 'user/header/HeaderMenu.css';

const HeaderMenu = () => {
  const [menus, setMenus] = useState([]);
  const [isHome, setIsHome] = useState(true);
  const isUserName = useSelector((state) => state.userState.userName);
  const isLoginState = useSelector((state) => state.userState.loginState);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/menus`);
        if (response.data) {
          setMenus(response.data);
        }
      } catch (error) {
        console.error('There was an error fetching the menu!', error);
      }
    };

    fetchMenus();
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
  }, [location]);

  const handleMenuMainClick = (menuUrl) => {
    console.log("menuUrl : ",menuUrl);
    navigate(menuUrl);
  };


  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    dispatch(setUserState({
      userCode: "",
      userName: "",
      userEmail: "",
      userCategory: "",	
      usageStatus: "",
      loginState: false,
    }));

    document.cookie = 'nid_aut=; path=/; domain=.naver.com; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    navigate('/');
  };

  return (
    <div className='header-menu-wrap'>
      <div className='header-menu-top-logo'>
        <img className="manager-menu-logo-img" src={`${process.env.REACT_APP_IMAGE_URL}/arentcar.png`} alt="" onClick={handleLogoClick} />
      </div>
      <div className="header-menu-top-menu">
        <ul>
          {menus.filter(menu => menu.menu_kind === "1" && menu.menu_type === "1").map((mainMemu, index) => (
            <li
              key={index}
              onClick={() => handleMenuMainClick(mainMemu.menu_component)}
            >
              {mainMemu.menu_name}
            </li>
          ))}
        </ul>
      </div>
      {isLoginState ?
        <div className='header-menu-top-login' onClick={handleLogoutClick}>
          <img className="manager-menu-login-img" src={`${process.env.REACT_APP_IMAGE_URL}/mypage.png`} alt="" />
          <span className="manager-menu-logout-btn">로그아웃</span>
          <span>({isUserName})</span>
        </div>
        :
        <div className='header-menu-top-login' onClick={handleLoginClick}>
          <img className="manager-menu-login-img" src={`${process.env.REACT_APP_IMAGE_URL}/mypage.png`} alt="" />
          <span className="manager-menu-login-btn">로그인</span>
          <span>회원가입</span>
        </div>
      }
    </div>
  );
};

export default HeaderMenu;