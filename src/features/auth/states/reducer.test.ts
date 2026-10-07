import { describe, expect, it } from "vitest";
import type { User } from "@/types";
import { isAuthLogin, isAuthLogout, isAuthRegister } from "./action";
import reducer, { clearAuthError, setAuthUser } from "./reducer";

const user: User = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  created_at: "2026-01-01T00:00:00.000Z",
};

describe("auth reducer", () => {
  it("stores a session and clears auth errors", () => {
    expect(reducer(undefined, { type: "unknown" })).toMatchObject({
      user: null,
      isAuthLogin: false,
      error: null,
    });
    expect(reducer(undefined, setAuthUser(user)).user).toEqual(user);
    expect(reducer({ ...reducer(undefined, { type: "unknown" }), error: "failed" }, clearAuthError()).error).toBeNull();
  });

  it("tracks login, registration, and logout request states", () => {
    const credentials = { email: user.email, password: "secret" };
    const registration = { ...credentials, name: user.name };
    const loginPending = reducer(undefined, isAuthLogin.pending("1", credentials));
    expect(loginPending.isAuthLogin).toBe(true);
    expect(reducer(loginPending, isAuthLogin.fulfilled({ user, token: "token" }, "2", credentials))).toMatchObject({
      isAuthLogin: false,
      user,
    });
    expect(reducer(loginPending, isAuthLogin.rejected(new Error("denied"), "3", credentials))).toMatchObject({
      isAuthLogin: false,
      error: "denied",
    });

    expect(reducer(undefined, isAuthRegister.pending("4", registration)).isAuthRegister).toBe(true);
    expect(reducer(undefined, isAuthRegister.fulfilled("ok", "5", registration)).isAuthRegister).toBe(false);
    expect(reducer(undefined, isAuthRegister.rejected(new Error("invalid"), "6", registration)).error).toBe("invalid");

    expect(reducer(undefined, isAuthLogout.pending("7", undefined)).isAuthLogout).toBe(true);
    expect(reducer({ ...reducer(undefined, { type: "unknown" }), user }, isAuthLogout.fulfilled("ok", "8", undefined))).toMatchObject({
      isAuthLogout: false,
      user: null,
    });
    expect(reducer(undefined, isAuthLogout.rejected(new Error("offline"), "9", undefined))).toMatchObject({
      isAuthLogout: false,
      error: "offline",
    });
  });
});
