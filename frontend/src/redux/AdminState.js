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
    setAdminState: (state, action) => {
      state.adminCode = action.payload.adminCode;
      state.adminName = action.payload.adminName;
      state.adminEmail = action.payload.adminEmail;
      state.adminRole = action.payload.adminRole;
      state.loginState = action.payload.loginState;
    },
  },
});

export const { setAdminState } = AdminState.actions;
export default AdminState.reducer;
