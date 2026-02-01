// eslint-disable-next-line import/no-extraneous-dependencies -- dependency of react-scripts
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "https://wso-dev.williams.edu",
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

  // fetch JSONs from prod
  app.use(
    createProxyMiddleware("/dining.json", {
      target: "https://wso.williams.edu",
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
  app.use(
    createProxyMiddleware("/library.json", {
      target: "https://wso.williams.edu",
      changeOrigin: true,
      secure: false,
    })
  );
  app.use(
    createProxyMiddleware("/courses-*.json", {
      target: "https://wso.williams.edu",
      changeOrigin: true,
      secure: false,
    })
  );
  // in case the above does not work
  app.use(
    createProxyMiddleware("/courses-factrak.json", {
      target: "https://wso.williams.edu",
      changeOrigin: true,
      secure: false,
    })
  );
};
