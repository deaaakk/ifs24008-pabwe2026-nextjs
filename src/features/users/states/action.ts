import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProfile,
  getUsers,
  updatePassword,
  updateProfile,
  updateProfilePhoto,
} from "../api/userApi";

export const fetchUsers = createAsyncThunk("users/list", async (_, { rejectWithValue }) => {
  try {
    return (await getUsers()).data.users;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Gagal memuat pengguna.");
  }
});

export const fetchProfile = createAsyncThunk(
  "users/profile",
  async (_, { rejectWithValue }) => {
    try {
      return (await getProfile()).data.user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Gagal memuat profil.");
    }
  },
);

export const changeProfile = createAsyncThunk(
  "users/changeProfile",
  async (profile: { name: string; email: string }, { rejectWithValue }) => {
    try {
      return (await updateProfile(profile)).data.user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Gagal memperbarui profil.");
    }
  },
);

export const changeProfilePhoto = createAsyncThunk(
  "users/changePhoto",
  async (photo: File, { rejectWithValue }) => {
    try {
      await updateProfilePhoto(photo);
      return (await getProfile()).data.user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Gagal mengganti foto.");
    }
  },
);

export const changeProfilePassword = createAsyncThunk(
  "users/changePassword",
  async (
    payload: { password: string; new_password: string; new_password_confirmation: string },
    { rejectWithValue },
  ) => {
    try {
      return (await updatePassword(payload)).message;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Gagal mengganti kata sandi.");
    }
  },
);
