import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  putAccessToken: vi.fn(),
}));

vi.mock("../api/authApi", () => ({
  login: mocks.login,
  logout: mocks.logout,
  register: mocks.register,
}));

vi.mock("@/helpers/apiHelper", () => ({
  putAccessToken: mocks.putAccessToken,
}));

import { isAuthLogin, isAuthLogout, isAuthRegister } from "./action";

const run = (thunk: ReturnType<typeof isAuthLogin> | ReturnType<typeof isAuthRegister> | ReturnType<typeof isAuthLogout>) =>
  thunk(vi.fn(), () => ({}), undefined);

describe("auth async actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stores a login token when present", async () => {
    const data = { token: "access-token", user: { id: 1 } };
    mocks.login.mockResolvedValue({ data });

    const result = await run(isAuthLogin({ email: "ayu@example.com", password: "secret" }));

    expect(result.type).toBe("auth/login/fulfilled");
    expect(result.payload).toEqual(data);
    expect(mocks.login).toHaveBeenCalledWith({ email: "ayu@example.com", password: "secret" });
    expect(mocks.putAccessToken).toHaveBeenCalledWith("access-token");
  });

  it.each([
    ["missing token", { data: { user: { id: 1 } } }, "auth/login/fulfilled"],
    ["missing data", {}, "auth/login/fulfilled"],
    ["null data", { data: null }, "auth/login/fulfilled"],
    ["missing result", undefined, "auth/login/rejected"],
  ])("does not store a token for %s", async (_label, response, expectedType) => {
    mocks.login.mockResolvedValue(response);

    const result = await run(isAuthLogin({ email: "ayu@example.com", password: "secret" }));

    expect(result.type).toBe(expectedType);
    expect(mocks.putAccessToken).not.toHaveBeenCalled();
  });

  it("rejects login errors with the original or fallback message", async () => {
    mocks.login.mockRejectedValueOnce(new Error("invalid credentials"));
    mocks.login.mockRejectedValueOnce("unexpected");

    const errorResult = await run(isAuthLogin({ email: "ayu@example.com", password: "secret" }));
    const fallbackResult = await run(isAuthLogin({ email: "ayu@example.com", password: "secret" }));

    expect(errorResult.payload).toBe("invalid credentials");
    expect(fallbackResult.payload).toBe("Login gagal.");
  });

  it("returns a registration message and normalizes failures", async () => {
    mocks.register.mockResolvedValue({ message: "created" });
    const success = await run(isAuthRegister({ name: "Ayu", email: "ayu@example.com", password: "secret" }));
    mocks.register.mockRejectedValueOnce(new Error("email already used"));
    mocks.register.mockRejectedValueOnce(null);

    const errorResult = await run(isAuthRegister({ name: "Ayu", email: "ayu@example.com", password: "secret" }));
    const fallbackResult = await run(isAuthRegister({ name: "Ayu", email: "ayu@example.com", password: "secret" }));

    expect(success.payload).toBe("created");
    expect(errorResult.payload).toBe("email already used");
    expect(fallbackResult.payload).toBe("Registrasi gagal.");
  });

  it("clears the token and returns a default logout message when needed", async () => {
    mocks.logout.mockResolvedValueOnce({ message: "signed out" });
    mocks.logout.mockResolvedValueOnce({});

    const success = await run(isAuthLogout());
    const fallbackMessage = await run(isAuthLogout());

    expect(success.payload).toBe("signed out");
    expect(fallbackMessage.payload).toBe("Logout berhasil");
    expect(mocks.putAccessToken).toHaveBeenCalledTimes(2);
    expect(mocks.putAccessToken).toHaveBeenNthCalledWith(1, null);
    expect(mocks.putAccessToken).toHaveBeenNthCalledWith(2, null);
  });

  it("rejects logout errors without clearing the token", async () => {
    mocks.logout.mockRejectedValueOnce(new Error("offline"));
    mocks.logout.mockRejectedValueOnce({ reason: "offline" });

    const errorResult = await run(isAuthLogout());
    const fallbackResult = await run(isAuthLogout());

    expect(errorResult.payload).toBe("offline");
    expect(fallbackResult.payload).toBe("Logout gagal.");
    expect(mocks.putAccessToken).not.toHaveBeenCalled();
  });
});
