import app from "./utils/app";

const PORT = Number(process.env.PORT || 8081);
const NODE_ENV = process.env.NODE_ENV ?? "development";

const server = Bun.serve({
  port: PORT,
  fetch: app.fetch,
});

console.log(`[${NODE_ENV}] Serving http://localhost:${server.port}`);
