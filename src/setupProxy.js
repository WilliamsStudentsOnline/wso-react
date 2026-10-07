// eslint-disable-next-line import/no-extraneous-dependencies -- dependency of react-scripts
const { createProxyMiddleware } = require("http-proxy-middleware");

// Anubis on prod challenges browser UAs; use a non-browser UA so local fetches get JSON
const prodProxy = {
  target: "https://wso.williams.edu",
  changeOrigin: true,
  secure: false,
  headers: {
    "User-Agent": "wso-react-dev-proxy",
  },
};

module.exports = function (app) {
  app.use(createProxyMiddleware("/api", prodProxy));

  app.use(
    // note that we do not currently deploy image service on dev server
    createProxyMiddleware("/pic", prodProxy)
  );

  // fetch JSONs from prod
  app.use(createProxyMiddleware("/dining.json", prodProxy));
  app.use(createProxyMiddleware("/courses.json", prodProxy));
  app.use(createProxyMiddleware("/library.json", prodProxy));
  app.use(createProxyMiddleware("/courses-*.json", prodProxy));
  // in case the above does not work
  app.use(createProxyMiddleware("/courses-factrak.json", prodProxy));
};
