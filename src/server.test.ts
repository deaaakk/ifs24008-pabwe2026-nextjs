import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { IncomingMessage, ServerResponse } from "node:http";

const mocks = vi.hoisted(() => ({
  createServer: vi.fn(),
  next: vi.fn(),
}));

vi.mock("node:http", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:http")>();
  return {
    ...actual,
    createServer: mocks.createServer,
    default: { ...actual, createServer: mocks.createServer },
  };
});
vi.mock("next", () => ({ default: mocks.next }));

describe("custom Next.js server", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("APP_PORT", "4312");
    mocks.createServer.mockReset();
    mocks.next.mockReset();
    const requestHandler = vi.fn();
    const listen = vi.fn((_port: number, onListening: () => void) => onListening());
    mocks.next.mockReturnValue({
      prepare: vi.fn().mockResolvedValue(undefined),
      getRequestHandler: vi.fn().mockReturnValue(requestHandler),
    });
    mocks.createServer.mockReturnValue({ listen });
    vi.spyOn(console, "info").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("prepares Next, forwards requests, and logs the listening URL", async () => {
    await import("./server");

    expect(mocks.next).toHaveBeenCalledWith({ dev: true, turbopack: true, port: 4312 });
    expect(mocks.createServer).toHaveBeenCalledWith(expect.any(Function));
    const listener = mocks.createServer.mock.calls[0]?.[0] as (
      request: IncomingMessage,
      response: ServerResponse,
    ) => void;
    const request = {} as IncomingMessage;
    const response = {} as ServerResponse;
    listener(request, response);
    expect(mocks.next.mock.results[0]?.value.getRequestHandler()).toHaveBeenCalledWith(request, response);
    expect(console.info).toHaveBeenCalledWith("> Ruang Cerita listening on http://localhost:4312");
  });

  it.each([
    ["not an integer", "not-a-port"],
    ["too low", "0"],
    ["too high", "65536"],
  ])("rejects a port that is %s", async (_description, port) => {
    vi.stubEnv("APP_PORT", port);

    await expect(import("./server")).rejects.toThrow(`APP_PORT must be a valid TCP port; received "${port}".`);
    expect(mocks.next).not.toHaveBeenCalled();
  });

  it("uses production mode when NODE_ENV is production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await import("./server");

    expect(mocks.next).toHaveBeenCalledWith({ dev: false, turbopack: true, port: 4312 });
  });

  it("uses --dev when NODE_ENV is unset and defaults to production otherwise", async () => {
    vi.stubEnv("NODE_ENV", "");
    const originalArgv = process.argv;
    process.argv = [...originalArgv, "--dev"];
    await import("./server");
    expect(mocks.next).toHaveBeenCalledWith({ dev: true, turbopack: true, port: 4312 });

    vi.resetModules();
    process.argv = originalArgv.filter((argument) => argument !== "--dev");
    await import("./server");
    expect(mocks.next).toHaveBeenLastCalledWith({ dev: false, turbopack: true, port: 4312 });
  });
});
