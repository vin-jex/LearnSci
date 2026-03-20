import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AuthState = {
  isLoading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    setSuccess(state, action: PayloadAction<string | null>) {
      state.successMessage = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const { setLoading, setError, setSuccess, clearMessages } =
  authSlice.actions;
export default authSlice.reducer;
