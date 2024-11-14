import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'manager/system/RegisterMenu.css';

const RegisterMenu = ({ onClick }) => {
  const [menus, setMenus] = useState([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const [workMode, setWorkMode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [totalMenus, setTotalMenus] = useState(0);

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

  const pageingMenus = async () => {
    try {
      const params = {
        pageSize,
        pageNumber,
      };
  
      if (searchName && searchName.trim() !== '') {
        params.menuName = searchName;
      }
  
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/menus/paged`, { params });
      if (response.data) {
        setMenus(response.data);
      }
    } catch (error) {
      console.error('There was an error fetching the menus pageing!', error);
    }
  };

  const getTotalMenusCount = async () => {
    try {

      console.log("searchName : ",searchName);
      const params = searchName ? { menuName: searchName } : {};
  
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/arentcar/manager/menus/count`, { params });
      if (typeof response.data === 'number') {
        setTotalMenus(response.data);
      } else {
        console.error('Unexpected response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching total menus count', error);
    }
  };

  useEffect(() => {
    pageingMenus();
    getTotalMenusCount();
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
  };

  const handleSearchClick = async () => {
    pageingMenus();
    getTotalMenusCount();
  };

  const handleInsertClick = (workMode) => {
    setIsPopUp(true);
    setWorkMode(workMode);
    viewDataInit();
  };

  const handleDeleteClick = async (menuCode) => {
    if (window.confirm('자료를 정말로 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/arentcar/manager/menus/${menuCode}`);
        setMenus((prevMenus) => prevMenus.filter(menu => menu.menu_code !== menuCode));
        alert("자료가 삭제되었습니다.");
      } catch (error) {
        alert("삭제 중 오류가 발생했습니다." + error);
      }
    }
  };

  const handleDataSaveClick = async () => {
    const newMenu = {
      menu_code: menuCode,
      menu_kind: menuKind,
      menu_main: menuMain,
      menu_sub: menuSub,
      menu_small: menuSmall,
      menu_type: menuType,
      menu_name: menuName,
      menu_component: menuComponent,
    };

    if (workMode === "수정") {
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/arentcar/manager/menus/${menuCode}`, newMenu);
        setMenus((prevMenus) => prevMenus.map(menu => menu.menu_code === menuCode ? newMenu : menu));
        alert("자료가 수정되었습니다.");
      } catch (error) {
        alert("수정 중 오류가 발생했습니다." + error);
      }
    } else {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/arentcar/manager/menus`, newMenu);
        setMenus((prevMenus) => [...prevMenus, newMenu]);
        alert("자료가 등록되었습니다.");
      } catch (error) {
        alert("등록 중 오류가 발생했습니다." + error);
      }
    }

    setIsPopUp(false);
  };

  const handlePopupClodeClick = () => {
    setIsPopUp(false);
  };

  const handleCloseClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const totalWidth = columnDefs.reduce((sum, columnDef) => {
    return sum + (columnDef.width ? columnDef.width : 150);
  }, 0);

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const totalPages = Math.ceil(totalMenus / pageSize);

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
            <span>[검색건수 : {totalMenus}건]</span>
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
    </div>
  );
}

export default RegisterMenu;
