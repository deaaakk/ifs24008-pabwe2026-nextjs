import { apiRequest } from "@/helpers/apiHelper";
import type { User } from "@/types";

export const getUsers = () => apiRequest<{ users: User[] }>("/users");
export const getProfile = () => apiRequest<{ user: User }>("/users/me");

export const updateProfile = (profile: Pick<User, "name" | "email">) =>
  apiRequest<{ user: User }>("/users/me", { method: "PUT", body: profile });

export const updateProfilePhoto = (photo: File) => {
  const body = new FormData();
  body.set("photo", photo);
  return apiRequest<never>("/users/me/photo", { method: "POST", body });
};

export const updatePassword = (body: {
  password: string;
  new_password: string;
  new_password_confirmation: string;
}) => apiRequest<never>("/users/password", { method: "PUT", body });
