import { configureStore } from '@reduxjs/toolkit';
import UserState from './UserState';

export const store = configureStore({
  reducer: {
    userState: UserState,
  },
});
