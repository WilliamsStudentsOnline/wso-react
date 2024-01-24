// eslint-disable-next-line import/no-extraneous-dependencies -- dependency of react-scripts
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "https://localhost:8080",
      changeOrigin: true,
      secure: false,
    })
  );

  app.use(
    // note that we do not currently deploy image service on dev server
    createProxyMiddleware("/pic", {
      target: "https://wso-dev.williams.edu",
      changeOrigin: true,
      secure: false,
    })
  );

  app.use(
    createProxyMiddleware("/courses.json", {
      target: "https://wso.williams.edu",
      changeOrigin: true,
      secure: false,
    })
  );
};
