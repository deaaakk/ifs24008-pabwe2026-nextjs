import { createSlice } from "@reduxjs/toolkit";
import type { User } from "@/types";
import {
  changeProfile,
  changeProfilePassword,
  changeProfilePhoto,
  fetchProfile,
  fetchUsers,
} from "./action";

interface UsersState {
  users: User[];
  profile: User | null;
  isUsers: boolean;
  isProfile: boolean;
  isChangeProfile: boolean;
  isChangeProfilePhoto: boolean;
  isChangeProfilePassword: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  profile: null,
  isUsers: false,
  isProfile: false,
  isChangeProfile: false,
  isChangeProfilePhoto: false,
  isChangeProfilePassword: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isUsers = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isUsers = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isUsers = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(fetchProfile.pending, (state) => {
        state.isProfile = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isProfile = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isProfile = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(changeProfile.pending, (state) => {
        state.isChangeProfile = true;
        state.error = null;
      })
      .addCase(changeProfile.fulfilled, (state, action) => {
        state.isChangeProfile = false;
        state.profile = action.payload;
      })
      .addCase(changeProfile.rejected, (state, action) => {
        state.isChangeProfile = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(changeProfilePhoto.pending, (state) => {
        state.isChangeProfilePhoto = true;
        state.error = null;
      })
      .addCase(changeProfilePhoto.fulfilled, (state, action) => {
        state.isChangeProfilePhoto = false;
        state.profile = action.payload;
      })
      .addCase(changeProfilePhoto.rejected, (state, action) => {
        state.isChangeProfilePhoto = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(changeProfilePassword.pending, (state) => {
        state.isChangeProfilePassword = true;
        state.error = null;
      })
      .addCase(changeProfilePassword.fulfilled, (state) => {
        state.isChangeProfilePassword = false;
      })
      .addCase(changeProfilePassword.rejected, (state, action) => {
        state.isChangeProfilePassword = false;
        state.error = String(action.payload ?? action.error.message);
      });
  },
});

export default usersSlice.reducer;
