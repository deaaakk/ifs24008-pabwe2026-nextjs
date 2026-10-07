import { createSlice } from "@reduxjs/toolkit";
import type { User } from "@/types";
import { isAuthLogin, isAuthLogout, isAuthRegister } from "./action";

interface AuthState {
  user: User | null;
  isAuthLogin: boolean;
  isAuthRegister: boolean;
  isAuthLogout: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthLogin: false,
  isAuthRegister: false,
  isAuthLogout: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser(state, action: { payload: User | null }) {
      state.user = action.payload;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(isAuthLogin.pending, (state) => {
        state.isAuthLogin = true;
        state.error = null;
      })
      .addCase(isAuthLogin.fulfilled, (state, action) => {
        state.isAuthLogin = false;
        state.user = action.payload.user;
      })
      .addCase(isAuthLogin.rejected, (state, action) => {
        state.isAuthLogin = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(isAuthRegister.pending, (state) => {
        state.isAuthRegister = true;
        state.error = null;
      })
      .addCase(isAuthRegister.fulfilled, (state) => {
        state.isAuthRegister = false;
      })
      .addCase(isAuthRegister.rejected, (state, action) => {
        state.isAuthRegister = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(isAuthLogout.pending, (state) => {
        state.isAuthLogout = true;
        state.error = null;
      })
      .addCase(isAuthLogout.fulfilled, (state) => {
        state.isAuthLogout = false;
        state.user = null;
      })
      .addCase(isAuthLogout.rejected, (state, action) => {
        state.isAuthLogout = false;
        state.error = String(action.payload ?? action.error.message);
      });
  },
});

export const { setAuthUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
