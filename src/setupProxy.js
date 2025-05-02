const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/HachionUserDashboad",
    createProxyMiddleware({
      target: "https://api.hachion.co/", //'http://localhost:8080/'
      changeOrigin: true,
      secure: false, // Disable SSL verification if using an HTTP API
      pathRewrite: {
        "^/HachionUserDashboad": "", // Rewrite the path if necessary
      },
    })
  );
};
