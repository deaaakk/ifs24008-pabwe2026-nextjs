import { apiRequest } from "@/helpers/apiHelper";
import type {
  AuthCredentials,
  AuthUserData,
  RegisterCredentials,
} from "@/types";

export const login = (credentials: AuthCredentials) =>
  apiRequest<AuthUserData>("/auth/login", {
    method: "POST",
    token: null,
    body: credentials,
  });

export const register = (credentials: RegisterCredentials) =>
  apiRequest<never>("/auth/register", {
    method: "POST",
    token: null,
    body: credentials,
  });

export const logout = () =>
  apiRequest<never>("/auth/logout", { method: "POST" });
