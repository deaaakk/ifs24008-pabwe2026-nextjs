import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiRequest, getAccessToken, putAccessToken } from "./apiHelper";

describe("apiHelper", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stores and removes access tokens", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    putAccessToken(null);
    expect(getAccessToken()).toBeNull();
  });

  it("does not access local storage outside a browser", () => {
    vi.stubGlobal("window", undefined);

    expect(getAccessToken()).toBeNull();
    expect(() => putAccessToken("server-token")).not.toThrow();
    expect(() => putAccessToken(null)).not.toThrow();
  });

  it("adds query parameters and the bearer token", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ status: "success", message: "ok", data: { value: 1 } })),
    );
    putAccessToken("token-123");

    const response = await apiRequest<{ value: number }>("/items", {
      query: { page: 2, include: true, ignored: null },
    });

    expect(response.data.value).toBe(1);
    const [url, init] = vi.mocked(fetch).mock.calls[0] as [URL, RequestInit];
    expect(url.search).toBe("?page=2&include=true");
    expect(new Headers(init.headers).get("Authorization")).toBe("Bearer token-123");
  });

  it("serializes JSON request bodies and reports failed responses", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ status: "success", message: "ok", data: {} })),
    );
    await apiRequest("/items", { method: "POST", token: null, body: { title: "hello" } });
    const init = vi.mocked(fetch).mock.calls[0]?.[1] as RequestInit;
    expect(init.body).toBe(JSON.stringify({ title: "hello" }));
    expect(new Headers(init.headers).get("Content-Type")).toBe("application/json");

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ status: "fail", message: "Unauthorized", data: {} }), { status: 401 }),
    );
    await expect(apiRequest("/private")).rejects.toBeInstanceOf(ApiError);
  });

  it("accepts absolute-style paths, caller headers, primitive bodies, and upload bodies", async () => {
    vi.mocked(fetch).mockImplementation(async () =>
      new Response(JSON.stringify({ status: "success", message: "ok", data: {} })),
    );

    await apiRequest("items", {
      token: "",
      headers: { "X-Trace": "trace-id", Accept: "text/plain" },
      body: "plain text",
    });
    const [stringUrl, stringInit] = vi.mocked(fetch).mock.calls[0] as [URL, RequestInit];
    expect(stringUrl.pathname).toBe("/api/v1/items");
    expect(new Headers(stringInit.headers).get("Accept")).toBe("application/json");
    expect(new Headers(stringInit.headers).get("X-Trace")).toBe("trace-id");
    expect(new Headers(stringInit.headers).has("Authorization")).toBe(false);
    expect(stringInit.body).toBe("plain text");

    const form = new FormData();
    form.set("file", "content");
    await apiRequest("/upload", { body: form });
    expect((vi.mocked(fetch).mock.calls[1]?.[1] as RequestInit).body).toBe(form);

    const blob = new Blob(["image"], { type: "image/png" });
    await apiRequest("/blob", { body: blob });
    expect((vi.mocked(fetch).mock.calls[2]?.[1] as RequestInit).body).toBe(blob);

    await apiRequest("/empty", { body: null, query: { omitted: undefined } });
    expect((vi.mocked(fetch).mock.calls[3]?.[1] as RequestInit).body).toBeUndefined();
  });

  it("uses a fallback API error message when the server message is empty", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ status: "fail", message: "", data: {} }), { status: 500 }),
    );

    await expect(apiRequest("/failure")).rejects.toMatchObject({
      message: "Permintaan tidak berhasil.",
      status: 500,
    });
  });
});
