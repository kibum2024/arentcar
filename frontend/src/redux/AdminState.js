import { createSlice } from '@reduxjs/toolkit';

const AdminState = createSlice({
  name: 'adminState',
  initialState: {
    adminCode: null,           
    adminName: null,           
    adminEmail: null,           
    adminRole: '1',           
    loginState: false,           
  },
  reducers: {
    // 관리자 권한 설정
    setAdminState: (state, action) => {
      state.adminCode = action.payload.adminCode;
      state.adminName = action.payload.adminName;
      state.adminEmail = action.payload.adminEmail;
      state.adminRole = action.payload.adminRole;
      state.loginState = action.payload.loginState;
    },
  },
});

// 액션과 리듀서를 export
export const { setAdminState } = AdminState.actions;
export default AdminState.reducer;
