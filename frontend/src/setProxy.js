import { createProxyMiddleware } from "http-proxy-middleware";

module.exports = function (app) {
  app.use(
    ["/backend", "/api-token-auth", "/graphql", "/api-token-refresh", "/api-token-verify"],
    createProxyMiddleware({
      target: "http://localhost:8000",
      changeOrigin: true,
    })
  );
};
