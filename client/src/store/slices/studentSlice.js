import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchStudents = createAsyncThunk(
  'student/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/students');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'ছাত্র লোড করতে ব্যর্থ');
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    students: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studentSlice.reducer;
