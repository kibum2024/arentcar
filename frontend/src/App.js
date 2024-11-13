import { useSelector } from 'react-redux';
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import ManagerMenu from 'manager/system/ManagerMenu';
import './App.css';

function App() {
  // const isUserRole = useSelector((state) => state.userState.userRole);
  // const isLoginState = useSelector((state) => state.userState.loginState);

  return (
    <div className="app-main-wrap">
      <ManagerMenu />
      {/* {isUserRole !== "3" ?
        (
          <div className='app-manager-content-wrap'>
            {isLoginState ? <ManagerMenu /> : <ManagerMenu />}
          </div>
        ) : (
          <>
            <div className='app-user-header-wrap'>
            </div>
            <div className='app-user-content-wrap'>
              <Routes>
                <Route path="/" element={<ContentHome />} ></Route>
                <Route path="/login" element={<UserLogin />} ></Route>
              </Routes>
            </div>
            <div className='app-user-footer-wrap'>
            </div>
          </>
        )} */}
    </div>
  );
}

export default App;
