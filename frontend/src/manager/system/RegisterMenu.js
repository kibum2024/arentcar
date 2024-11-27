import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { refreshAccessToken, handleAdminLogout } from 'common/Common';
import Loading from 'common/Loading';
import 'manager/system/RegisterMenu.css';

const RegisterMenu = ({ onClick }) => {
  const [menus, setMenus] = useState([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [workMode, setWorkMode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);

  const [columnDefs] = useState([
    { headerName: '코드', field: 'menu_code', width: 80, align: 'center' },
    { headerName: '메뉴구분', field: 'menu_kind', width: 80, align: 'center' },
    { headerName: '대분류', field: 'menu_main', width: 80, align: 'center' },
    { headerName: '중분류', field: 'menu_sub', width: 80, align: 'center' },
    { headerName: '소분류', field: 'menu_small', width: 80, align: 'center' },
    { headerName: '분류구분', field: 'menu_type', width: 80, align: 'center' },
    { headerName: '권한', field: 'menu_role', width: 100, align: 'center' },
    { headerName: '메뉴명', field: 'menu_name', width: 300, align: 'left' },
    { headerName: '프로그램명', field: 'menu_component', width: 200, align: 'left' },
    { headerName: '작업', field: '', width: 200, align: 'center' },
  ]);

  const [menuCode, setMenuCode] = useState("");
  const [menuKind, setMenuKind] = useState("");
  const [menuMain, setMenuMain] = useState("");
  const [menuSub, setMenuSub] = useState("");
  const [menuSmall, setMenuSmall] = useState("");
  const [menuType, setMenuType] = useState("");
  const [menuRole, setMenuRole] = useState("");
  const [menuName, setMenuName] = useState("");
  const [menuComponent, setMenuComponent] = useState("");

  const optionsMenuKind = [
    { value: '1', label: '사용자메뉴' },
    { value: '2', label: '관리자메뉴' },
  ];

  const optionsMenuRole = [
    { value: '1', label: '시스템메뉴' },
    { value: '2', label: '사용자메뉴' },
  ];

  const optionsMenuType = [
    { value: '1', label: '대분류메뉴' },
    { value: '2', label: '중분류메뉴' },
    { value: '3', label: '소분류메뉴' },
  ];

  const pageingMenus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await getMenus(token);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getMenus(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleAdminLogout();
        }
      } else {
        console.error('There was an error fetching the menus pageing!', error);
      }
    }
  };

  const getMenus = async (token) => {
    const params = {
      pageSize,
      pageNumber,
    };

    if (searchName && searchName.trim() !== '') {
      params.menuName = searchName;
    }

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/menus/paged`, 
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });

    if (response.data) {
      setMenus(response.data);
    }
  };

  const getTotalCount = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await getCount(token);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        try {
          const newToken = await refreshAccessToken();
          await getCount(newToken);
        } catch (error) {
          alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
          handleAdminLogout();
        }
      } else {
        console.error('There was an error fetching the Menus count!', error);
      }
    }
  };

  const getCount = async (token) => {
    const params = searchName ? { menuName: searchName } : {};

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/menus/count`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });

    if (typeof response.data === 'number') {
      setTotalCount(response.data);
    } else {
      console.error('Unexpected response:', response.data);
    }
  };

  useEffect(() => {
    pageingMenus();
    getTotalCount();
  }, [pageNumber, pageSize]);

  const handleUpdateClick = (updateData, workMode) => {
    setIsPopUp(true);
    setWorkMode(workMode);
    setMenuCode(updateData.menu_code);
    setMenuKind(updateData.menu_kind);
    setMenuMain(updateData.menu_main);
    setMenuSub(updateData.menu_sub);
    setMenuSmall(updateData.menu_small);
    setMenuType(updateData.menu_type);
    setMenuRole(updateData.menu_role);
    setMenuName(updateData.menu_name);
    setMenuComponent(updateData.menu_component);
  };

  const viewDataInit = () => {
    setMenuCode("");
    setMenuKind("1");
    setMenuMain("");
    setMenuSub("");
    setMenuSmall("");
    setMenuType("1");
    setMenuRole("2");
    setMenuName("");
    setMenuComponent("");
  };

  const handleSearchClick = async () => {
    pageingMenus();
    getTotalCount();
  };

  const handleInsertClick = (workMode) => {
    setIsPopUp(true);
    setWorkMode(workMode);
    viewDataInit();
  };

  const handleDeleteClick = async (menuCode) => {
    if (window.confirm('자료를 정말로 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('accessToken');
        await deleteMenu(token, menuCode);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await deleteMenu(newToken, menuCode);
          } catch (error) {
            alert("인증이 만료되었습니다. 다시 로그인 해주세요.");
            handleAdminLogout();
          }
        } else {
          alert("삭제 중 오류가 발생했습니다." + error);
        }
      }
    }
  };

  const deleteMenu = async (token, menuCode) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/arentcar/manager/menus/${menuCode}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true,
    });
    setMenus((prevMenus) => prevMenus.filter(menu => menu.menu_code !== menuCode));
    alert("자료가 삭제되었습니다.");
  };

  const handleDataSaveClick = async () => {
    if (!validateCheck()) {
      return; 
    }

    const newMenu = {
      menu_code: menuCode,
      menu_kind: menuKind,
      menu_main: menuMain,
      menu_sub: menuSub,
      menu_small: menuSmall,
      menu_type: menuType,
      menu_role: menuRole,
      menu_name: menuName,
      menu_component: menuComponent,
    };

    if (workMode === "수정") {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        await updateMenu(token, newMenu);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await updateMenu(newToken, newMenu);
          } catch (error) {
            alert("인증이 만료되었습니다. 다시 로그인 해주세요." + error);
            handleAdminLogout();
          }
        } else {
          alert("수정 중 오류가 발생했습니다." + error);
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        await createMenu(token, newMenu);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshAccessToken();
            await createMenu(newToken, newMenu);
          } catch (error) {
            alert("인증이 만료되었습니다. 다시 로그인 해주세요." + error);
            handleAdminLogout();
          }
        } else {
          alert("등록 중 오류가 발생했습니다." + error);
        }
      } finally {
        setLoading(false);
      }
    }

    setIsPopUp(false);
  };

  const updateMenu = async (token, newMenu) => {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/arentcar/manager/menus/${menuCode}`,
      newMenu,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    setMenus((prevMenu) => prevMenu.map(menu => menu.mMenu_code === menuCode ? newMenu : menu));
    alert("자료가 수정되었습니다.");
  };

  const createMenu = async (token, newMenu) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/arentcar/manager/menus`, 
      newMenu,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });
    newMenu.menu_code = response.data.menu_code;
    newMenu.menu_password = response.data.menu_password;
    setMenus((prevMenu) => [...prevMenu, newMenu]);
    alert("자료가 등록되었습니다.");
  };

  const handlePopupClodeClick = () => {
    setIsPopUp(false);
  };

  const handleCloseClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const validateCheck = () => {
    if (!menuMain || menuMain.trim() === '') {
      alert("메뉴대분류를 입력해주세요.");
      return false;
    };
    if (!menuSub || menuSub.trim() === '') {
      alert("메뉴중분류를 입력해주세요.");
      return false;
    };
    if (!menuSmall || menuSmall.trim() === '') {
      alert("메뉴소분류를 입력해주세요.");
      return false;
    };
    if (!menuName || menuName.trim() === '') {
      alert("메뉴명을 입력해주세요.");
      return false;
    };
  
    return true; 
  };

  const totalWidth = columnDefs.reduce((sum, columnDef) => {
    return sum + (columnDef.width ? columnDef.width : 150);
  }, 0);

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  let totalPages = Math.ceil(totalCount / pageSize);
  if (totalPages < 1) {
    totalPages = 1;
  }

  return (
    <div className='register-menu-wrap'>
      <div className='register-menu-header-wrap'>
        <div className='register-menu-title-wrap'>
          <div className='manager-title'>● 메뉴등록</div>
        </div>
        <div
          className='register-menu-button-wrap'
          style={{ width: `${totalWidth}px` }}
        >
          <div className='flex-align-center'>
            <label className='manager-label' htmlFor="">메뉴명</label>
            <input className='width200' type="text" value={searchName} onChange={(e) => (setSearchName(e.target.value))}/>
            <button className='manager-button manager-button-search' onClick={() => handleSearchClick()}>검색</button>
            <span>[검색건수 : {totalCount}건]</span>
          </div>
          <div>
            <button className='manager-button manager-button-insert' onClick={() => handleInsertClick("등록")}>추가</button>
            <button className='manager-button manager-button-close' onClick={() => handleCloseClick()}>닫기</button>
          </div>
        </div>
      </div>
      <div className='register-menu-content-wrap'>
        <div className='register-menu-content-header'>
          {columnDefs.map((title, index) => (
            <div key={index} className='manager-head-column' style={{ width: `${title.width}px`, textAlign: `center` }}>{title.headerName}</div>
          ))}
        </div>
        <div className='register-menu-content-row-wrap'>
          {menus.map((row, index) => (
            <div key={index} className='register-menu-content-row'>
              {columnDefs.map((title, index) => (
                <div
                  key={index} className='manager-row-column'
                  style={{
                    ...(title.field === '' ? { display: 'flex' } : ''),
                    ...(title.field === '' ? { alignItems: 'center' } : ''),
                    ...(title.field === '' ? { justifyContent: 'center' } : ''),
                    width: `${title.width}px`,
                    textAlign: `${title.align}`
                  }}
                >
                  {title.field === '' ? (
                    <>
                      <button className='manager-button manager-button-update' onClick={() => handleUpdateClick(row, "수정")}>수정</button>
                      <button className='manager-button manager-button-delete' onClick={() => handleDeleteClick(row.menu_code)}>삭제</button>
                    </>
                  ) : (
                    title.field === 'menu_role' ? (
                      optionsMenuRole.find(option => option.value === row[title.field])?.label || row[title.field]
                    ) :
                      row[title.field]
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        {isPopUp &&
          <div className='manager-popup'>
            <div className='register-menu-content-popup-wrap'>
              <div className='register-menu-content-popup-close'>
                <div className='manager-popup-title'>● 메뉴{workMode}</div>
                <div className='register-menu-content-popup-button'>
                  <button className='manager-button manager-button-save' onClick={handleDataSaveClick}>저장</button>
                  <button className='manager-button manager-button-close' onClick={handlePopupClodeClick}>닫기</button>
                </div>
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">메뉴코드</label>
                <input className='width50  word-center' type="text" value={menuCode} disabled />
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">메뉴구분</label>
                <select className='width100' id="comboBox" value={menuKind} onChange={(e) => (setMenuKind(e.target.value))}>
                  {optionsMenuKind.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">대분류</label>
                <input className='width30 word-center' value={menuMain} type="text" maxLength={2} onChange={(e) => setMenuMain(e.target.value)} />
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">중분류</label>
                <input className='width30 word-center' value={menuSub} type="text" maxLength={2} onChange={(e) => setMenuSub(e.target.value)} />
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">소분류</label>
                <input className='width30 word-center' value={menuSmall} type="text" maxLength={2} onChange={(e) => setMenuSmall(e.target.value)} />
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">분류구분</label>
                <select className='width100' id="comboBox" value={menuType} onChange={(e) => (setMenuType(e.target.value))}>
                  {optionsMenuType.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">메뉴권한</label>
                <select className='width150' id="comboBox" value={menuRole} onChange={(e) => (setMenuRole(e.target.value))}>
                  {optionsMenuRole.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">메뉴명</label>
                <input className='width300' type="text" value={menuName} maxLength={30} onChange={(e) => setMenuName(e.target.value)} />
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">프로그램명</label>
                <input className='width300' type="text" value={menuComponent} maxLength={20} onChange={(e) => setMenuComponent(e.target.value)} />
              </div>
            </div>
          </div>
        }
      </div>
      <div className='register-menu-pageing-wrap flex-align-center'>
        <button 
          className='manager-button'
          style={{color: pageNumber === 1 ?  '#aaa' : 'rgb(38, 49, 155)'}} 
          onClick={() => handlePageChange(pageNumber - 1)} 
          disabled={pageNumber === 1}
        >이전</button>
        <div className='register-menu-pageing-display'>{pageNumber} / {totalPages}</div>
        <button 
          className='manager-button' 
          style={{color: pageNumber === totalPages ?  '#aaa' : 'rgb(38, 49, 155)'}} 
          onClick={() => handlePageChange(pageNumber + 1)} 
          disabled={pageNumber === totalPages}
        >다음</button>
      </div>
      {loading && (
        <Loading />
      )}
    </div>
  );
}

export default RegisterMenu;
