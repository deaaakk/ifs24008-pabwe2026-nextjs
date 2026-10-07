import { createAsyncThunk } from "@reduxjs/toolkit";
import { putAccessToken } from "@/helpers/apiHelper";
import { login, logout, register } from "../api/authApi";
import type { AuthCredentials, RegisterCredentials } from "@/types";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const isAuthLogin = createAsyncThunk(
  "auth/login",
  async (credentials: AuthCredentials, { rejectWithValue }) => {
    try {
      const result = await login(credentials);
      if (result?.data?.token) {
        putAccessToken(result.data.token);
      }
      return result.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Login gagal."));
    }
  },
);

export const isAuthRegister = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      return (await register(credentials)).message;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Registrasi gagal."));
    }
  },
);

export const isAuthLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const result = await logout();
      putAccessToken(null);
      return result?.message ?? "Logout berhasil";
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Logout gagal."));
    }
  },
);
