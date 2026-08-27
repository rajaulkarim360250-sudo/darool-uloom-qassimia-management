import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchIncomes = createAsyncThunk(
  'income/fetchIncomes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/income');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'আয় লোড করতে ব্যর্থ');
    }
  }
);

const incomeSlice = createSlice({
  name: 'income',
  initialState: {
    incomes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.incomes = action.payload;
      })
      .addCase(fetchIncomes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default incomeSlice.reducer;
