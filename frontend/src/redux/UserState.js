import { createSlice } from '@reduxjs/toolkit';

const UserState = createSlice({
  name: 'userState',
  initialState: {
    userRole: '3',           
    userCode: null,           
    userName: null,           
    userEmail: null,           
    loginState: false,           
  },
  reducers: {
    // 관리자 권한 설정
    setUserState: (state, action) => {
      state.userRole = action.payload.userRole;
      state.userCode = action.payload.userCode;
      state.userName = action.payload.userName;
      state.userEmail = action.payload.userEmail;
      state.loginState = action.payload.loginState;
    },
  },
});

// 액션과 리듀서를 export
export const { setUserState } = UserState.actions;
export default UserState.reducer;
