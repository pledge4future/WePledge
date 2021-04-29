const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    proxy(["/backend", "/graphql", "/api-token-auth", "/api-token-refresh", "/api-token-verify"], {
      target: "http://localhost:8000",
    })
  );
};
