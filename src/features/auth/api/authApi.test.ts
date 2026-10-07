import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "@/helpers/apiHelper";
import { login, logout, register } from "./authApi";

vi.mock("@/helpers/apiHelper", () => ({ apiRequest: vi.fn() }));

describe("authApi", () => {
  beforeEach(() => vi.mocked(apiRequest).mockReset().mockResolvedValue({ status: "success", message: "ok", data: {} }));

  it("calls the Delcom authentication endpoints", async () => {
    await login({ email: "a@b.test", password: "secret" });
    expect(apiRequest).toHaveBeenLastCalledWith("/auth/login", {
      method: "POST",
      token: null,
      body: { email: "a@b.test", password: "secret" },
    });
    await register({ name: "A User", email: "a@b.test", password: "secret" });
    expect(apiRequest).toHaveBeenLastCalledWith("/auth/register", {
      method: "POST",
      token: null,
      body: { name: "A User", email: "a@b.test", password: "secret" },
    });
    await logout();
    expect(apiRequest).toHaveBeenLastCalledWith("/auth/logout", { method: "POST" });
  });
});
