import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import incomeReducer from './slices/incomeSlice';
import expenseReducer from './slices/expenseSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    student: studentReducer,
    income: incomeReducer,
    expense: expenseReducer,
  },
});

export default store;
