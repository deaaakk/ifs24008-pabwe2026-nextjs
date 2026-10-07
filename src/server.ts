import { createServer } from "node:http";
import next from "next";
import { APP_PORT } from "./lib/config";

if (!Number.isInteger(APP_PORT) || APP_PORT < 1 || APP_PORT > 65535) {
  throw new Error(`APP_PORT must be a valid TCP port; received "${process.env.APP_PORT}".`);
}

const dev = process.env.NODE_ENV
  ? process.env.NODE_ENV !== "production"
  : process.argv.includes("--dev");
const app = next({ dev, turbopack: true, port: APP_PORT });
const handle = app.getRequestHandler();

await app.prepare();
createServer((request, response) => {
  void handle(request, response);
}).listen(APP_PORT, () => {
  console.info(`> Ruang Cerita listening on http://localhost:${APP_PORT}`);
});
