import { createSlice } from '@reduxjs/toolkit';

const UserState = createSlice({
  name: 'userState',
  initialState: {
    userCode: null,           
    userName: null,           
    userEmail: null,           
    userCategory: null,           
    usageStatus: null,           
    loginState: false,           
  },
  reducers: {
    setUserState: (state, action) => {
      state.userCode = action.payload.userCode;
      state.userName = action.payload.userName;
      state.userEmail = action.payload.userEmail;
      state.userCategory = action.payload.userCategory;
      state.usageStatus = action.payload.usageStatus;
      state.loginState = action.payload.loginState;
    },
  },
});

export const { setUserState } = UserState.actions;
export default UserState.reducer;
