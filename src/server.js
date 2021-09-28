const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const { createProxyMiddleware } = require("http-proxy-middleware");

app.prepare().then(() => {
  const server = express();

  if (dev) {
    server.use(
      "/api",
      createProxyMiddleware({
        target: "http://localhost:3001",
        changeOrigin: true,
      })
    );
  }

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
