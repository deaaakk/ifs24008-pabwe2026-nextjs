import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getProfile: vi.fn(),
  getUsers: vi.fn(),
  updatePassword: vi.fn(),
  updateProfile: vi.fn(),
  updateProfilePhoto: vi.fn(),
}));

vi.mock("../api/userApi", () => mocks);

import {
  changeProfile,
  changeProfilePassword,
  changeProfilePhoto,
  fetchProfile,
  fetchUsers,
} from "./action";

const run = (thunk: ReturnType<typeof fetchUsers> | ReturnType<typeof fetchProfile> | ReturnType<typeof changeProfile> | ReturnType<typeof changeProfilePhoto> | ReturnType<typeof changeProfilePassword>) =>
  thunk(vi.fn(), () => ({}), undefined);

const user = { id: 1, name: "Ayu", email: "ayu@example.com" };

describe("user async actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads users and profile", async () => {
    mocks.getUsers.mockResolvedValue({ data: { users: [user] } });
    mocks.getProfile.mockResolvedValue({ data: { user } });

    expect((await run(fetchUsers())).payload).toEqual([user]);
    expect((await run(fetchProfile())).payload).toEqual(user);
  });

  it("updates profile, photo, and password", async () => {
    const profile = { name: "Ayu", email: "ayu@example.com" };
    const password = { password: "old", new_password: "new", new_password_confirmation: "new" };
    const photo = new File(["photo"], "photo.png", { type: "image/png" });
    mocks.updateProfile.mockResolvedValue({ data: { user } });
    mocks.updateProfilePhoto.mockResolvedValue(undefined);
    mocks.getProfile.mockResolvedValue({ data: { user } });
    mocks.updatePassword.mockResolvedValue({ message: "password updated" });

    expect((await run(changeProfile(profile))).payload).toEqual(user);
    expect((await run(changeProfilePhoto(photo))).payload).toEqual(user);
    expect((await run(changeProfilePassword(password))).payload).toBe("password updated");
    expect(mocks.updateProfile).toHaveBeenCalledWith(profile);
    expect(mocks.updateProfilePhoto).toHaveBeenCalledWith(photo);
    expect(mocks.updatePassword).toHaveBeenCalledWith(password);
  });

  it.each([
    ["fetchUsers", (error: unknown) => { mocks.getUsers.mockRejectedValue(error); return fetchUsers(); }, "Gagal memuat pengguna."],
    ["fetchProfile", (error: unknown) => { mocks.getProfile.mockRejectedValue(error); return fetchProfile(); }, "Gagal memuat profil."],
    ["changeProfile", (error: unknown) => { mocks.updateProfile.mockRejectedValue(error); return changeProfile({ name: "A", email: "a@b.test" }); }, "Gagal memperbarui profil."],
    ["changeProfilePhoto", (error: unknown) => { mocks.updateProfilePhoto.mockRejectedValue(error); return changeProfilePhoto(new File([], "x.png")); }, "Gagal mengganti foto."],
    ["changeProfilePassword", (error: unknown) => { mocks.updatePassword.mockRejectedValue(error); return changeProfilePassword({ password: "x", new_password: "y", new_password_confirmation: "y" }); }, "Gagal mengganti kata sandi."],
  ])("rejects %s with an API error or fallback", async (_name, createThunk, fallbackMessage) => {
    const errorResult = await run(createThunk(new Error("reported error")));
    expect(errorResult.meta.requestStatus).toBe("rejected");
    expect(errorResult.payload).toBe("reported error");

    vi.clearAllMocks();
    const fallbackResult = await run(createThunk("unexpected error"));
    expect(fallbackResult.meta.requestStatus).toBe("rejected");
    expect(fallbackResult.payload).toBe(fallbackMessage);
  });

  it("uses the fallback error if reloading the profile after a photo update fails", async () => {
    mocks.updateProfilePhoto.mockResolvedValue(undefined);
    mocks.getProfile.mockRejectedValue({ reason: "offline" });

    const result = await run(changeProfilePhoto(new File([], "x.png")));

    expect((result as { payload: unknown }).payload).toBe("Gagal mengganti foto.");
  });
});
