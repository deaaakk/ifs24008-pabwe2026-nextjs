import { describe, expect, it } from "vitest";
import type { User } from "@/types";
import {
  changeProfile,
  changeProfilePassword,
  changeProfilePhoto,
  fetchProfile,
  fetchUsers,
} from "./action";
import reducer from "./reducer";

const user: User = {
  id: 2,
  name: "Member",
  email: "member@example.com",
  created_at: "2026-01-01T00:00:00.000Z",
};

describe("users reducer", () => {
  it("starts with empty users and profile state", () => {
    expect(reducer(undefined, { type: "unknown" })).toMatchObject({
      users: [],
      profile: null,
      isUsers: false,
      isProfile: false,
    });
  });

  it("tracks list, profile, and account mutation states", () => {
    expect(reducer(undefined, fetchUsers.pending("1", undefined)).isUsers).toBe(true);
    expect(reducer(undefined, fetchUsers.fulfilled([user], "2", undefined)).users).toEqual([user]);
    expect(reducer(undefined, fetchUsers.rejected(new Error("list failed"), "3", undefined)).error).toBe("list failed");

    expect(reducer(undefined, fetchProfile.pending("4", undefined)).isProfile).toBe(true);
    expect(reducer(undefined, fetchProfile.fulfilled(user, "5", undefined)).profile).toEqual(user);
    expect(reducer(undefined, fetchProfile.rejected(new Error("profile failed"), "6", undefined)).error).toBe("profile failed");

    const profile = { name: user.name, email: user.email };
    expect(reducer(undefined, changeProfile.pending("7", profile)).isChangeProfile).toBe(true);
    expect(reducer(undefined, changeProfile.fulfilled(user, "8", profile)).profile).toEqual(user);
    expect(reducer(undefined, changeProfile.rejected(new Error("update failed"), "9", profile)).error).toBe("update failed");

    const photo = new File(["photo"], "photo.png", { type: "image/png" });
    expect(reducer(undefined, changeProfilePhoto.pending("10", photo)).isChangeProfilePhoto).toBe(true);
    expect(reducer(undefined, changeProfilePhoto.fulfilled(user, "11", photo)).profile).toEqual(user);
    expect(reducer(undefined, changeProfilePhoto.rejected(new Error("photo failed"), "12", photo)).error).toBe("photo failed");

    const password = { password: "old", new_password: "new123", new_password_confirmation: "new123" };
    expect(reducer(undefined, changeProfilePassword.pending("13", password)).isChangeProfilePassword).toBe(true);
    expect(reducer(undefined, changeProfilePassword.fulfilled("ok", "14", password)).isChangeProfilePassword).toBe(false);
    expect(reducer(undefined, changeProfilePassword.rejected(new Error("password failed"), "15", password)).error).toBe("password failed");
  });
});
