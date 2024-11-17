import { configureStore } from '@reduxjs/toolkit';
import UserState from './UserState';
import AdminState from './AdminState';

export const store = configureStore({
  reducer: {
    userState: UserState,
    adminState: AdminState,
  },
});
