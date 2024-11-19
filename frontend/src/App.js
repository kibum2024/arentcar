import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserMenu from 'user/header/UserMenu';
import ManagerMenu from 'manager/system/ManagerMenu';
import ManagerLogin from 'manager/system/ManagerLogin';
import './App.css';

function RequireAuth({ children }) {
  const isAuthenticated = useSelector((state) => state.adminState.loginState);
  
  if (!isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  return children;
}

function App() {
  const isAuthenticated = useSelector((state) => state.adminState.loginState);

  return (
    <div className="app-main-wrap">
      <Routes>
        {/* 로그인 페이지 */}
        <Route
          path="/admin"
          element={
            isAuthenticated ? (
              <Navigate to="/admin/main" />
            ) : (
              <ManagerLogin />
            )
          }
        />

        {/* 관리자 페이지 */}
        <Route path="/admin/*" 
          element={
            <RequireAuth>
              <ManagerMenu />
            </RequireAuth>
          }
        />

        {/* 사용자 페이지 */}
        <Route path="/*" element={<UserMenu />} />

        {/* 오류발생시   */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
