// file: store.ts
import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './employee/employeeReducer';

// We'll use redux-logger just as an example of adding another middleware

const reducer = {
  employee: employeeReducer,

};

const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store;
