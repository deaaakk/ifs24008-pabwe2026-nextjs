import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "@/helpers/apiHelper";
import { getProfile, getUsers, updatePassword, updateProfile, updateProfilePhoto } from "./userApi";

vi.mock("@/helpers/apiHelper", () => ({ apiRequest: vi.fn() }));

describe("userApi", () => {
  beforeEach(() => vi.mocked(apiRequest).mockReset().mockResolvedValue({ status: "success", message: "ok", data: {} }));

  it("uses the documented user and profile endpoints", async () => {
    await getUsers();
    expect(apiRequest).toHaveBeenLastCalledWith("/users");
    await getProfile();
    expect(apiRequest).toHaveBeenLastCalledWith("/users/me");
    await updateProfile({ name: "A User", email: "a@b.test" });
    expect(apiRequest).toHaveBeenLastCalledWith("/users/me", {
      method: "PUT",
      body: { name: "A User", email: "a@b.test" },
    });
    const photo = new File(["avatar"], "avatar.png", { type: "image/png" });
    await updateProfilePhoto(photo);
    const photoCall = vi.mocked(apiRequest).mock.calls.at(-1);
    expect(photoCall?.[0]).toBe("/users/me/photo");
    expect(photoCall?.[1]?.method).toBe("POST");
    expect(photoCall?.[1]?.body).toBeInstanceOf(FormData);
    await updatePassword({ password: "old", new_password: "new123", new_password_confirmation: "new123" });
    expect(apiRequest).toHaveBeenLastCalledWith("/users/password", {
      method: "PUT",
      body: { password: "old", new_password: "new123", new_password_confirmation: "new123" },
    });
  });
});
