import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'manager/system/RegisterMenu.css';

const RegisterMenu = () => {
  const [menus, setMenus] = useState([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const [workMode, setWorkMode] = useState("");
  const [columnDefs] = useState([
    { headerName: '코드', field: 'menu_code', width: 80, align: 'center' },
    { headerName: '메뉴구분', field: 'menu_kind', width: 80, align: 'center' },
    { headerName: '대분류', field: 'menu_main', width: 80, align: 'center' },
    { headerName: '중분류', field: 'menu_sub', width: 80, align: 'center' },
    { headerName: '소분류', field: 'menu_small', width: 80, align: 'center' },
    { headerName: '분류구분', field: 'menu_type', width: 80, align: 'center' },
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
  const [menuName, setMenuName] = useState("");
  const [menuComponent, setMenuComponent] = useState("");

  const optionsMenuKind = [
    { value: '1', label: '사용자메뉴' },
    { value: '2', label: '관리자메뉴' },
  ];

  const optionsMenuType = [
    { value: '1', label: '대분류메뉴' },
    { value: '2', label: '중분류메뉴' },
    { value: '3', label: '소분류메뉴' },
  ];

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

  const handleUpdateClick = (updateData, workMode) => {
    setIsPopUp(true);
    setWorkMode(workMode);
    setMenuCode(updateData.menu_code);
    setMenuKind(updateData.menu_kind);
    setMenuMain(updateData.menu_main);
    setMenuSub(updateData.menu_sub);
    setMenuSmall(updateData.menu_small);
    setMenuType(updateData.menu_type);
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
    setMenuName("");
    setMenuComponent("");
  }

  const handleInsertClick = (workMode) => {
    setIsPopUp(true);
    setWorkMode(workMode);
    viewDataInit();
  };

  const handleDeleteClick = (menuCode) => {
    if (window.confirm('자료를 정말로 삭제하시겠습니까?')) {
      setMenus((prevMenus) => prevMenus.filter(menu => menu.menu_code !== menuCode));
    }
  };

  const handleDataSaveClick = () => {
    setIsPopUp(false);
  };

  const handlePopupClodeClick = () => {
    setIsPopUp(false);
  };

  return (
    <div className='register-menu-wrap'>
      <div className='register-menu-header-wrap'>
        <div className='register-menu-title-wrap'>
          <div className='manager-title'>● 메뉴등록</div>
        </div>
        <div className='register-menu-button-wrap'>
          <label className='manager-label' htmlFor="">메뉴명</label>
          <input className='width200' type="text" />
          <button className='manager-button manager-button-search'>검색</button>
          <button className='manager-button manager-button-insert' onClick={() => handleInsertClick("등록")}>추가</button>
          <button className='manager-button manager-button-close'>닫기</button>
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
                <input className='width30 word-center' value={menuMain} type="text" maxLength={2}/>
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">중분류</label>
                <input className='width30 word-center' value={menuSub} type="text" maxLength={2}/>
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">소분류</label>
                <input className='width30 word-center' value={menuSmall} type="text" maxLength={2}/>
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
                <label className='width80 word-right label-margin-right' htmlFor="">메뉴명</label>
                <input className='width300' type="text" value={menuName} maxLength={30}/>
              </div>
              <div className='register-menu-content-popup-line'>
                <label className='width80 word-right label-margin-right' htmlFor="">프로그래명</label>
                <input className='width300' type="text" value={menuComponent} maxLength={20}/>
              </div>
            </div>
          </div>
        }
      </div>
      <div className='register-menu-pageing-wrap'>

      </div>
    </div>
  );
}

export default RegisterMenu;