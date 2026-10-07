import { DELCOM_BASEURL } from "@/lib/config";
import type { ApiResult } from "@/types";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status = 0,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("delcom_access_token");
}

export function putAccessToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem("delcom_access_token", token);
  else window.localStorage.removeItem("delcom_access_token");
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  query?: Record<string, string | number | boolean | null | undefined>;
  token?: string | null;
  body?: BodyInit | object | null;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResult<T>> {
  const { query, token = getAccessToken(), body, headers, ...requestOptions } = options;
  const url = new URL(`${DELCOM_BASEURL}${path.startsWith("/") ? path : `/${path}`}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== null && value !== undefined) url.searchParams.set(key, String(value));
  }

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  let requestBody: BodyInit | undefined;
  if (body instanceof FormData || body instanceof Blob || typeof body === "string") {
    requestBody = body;
  } else if (body !== null && body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(url, {
    ...requestOptions,
    headers: requestHeaders,
    body: requestBody,
  });
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || result.status !== "success") {
    throw new ApiError(result.message || "Permintaan tidak berhasil.", response.status);
  }
  return result;
}
