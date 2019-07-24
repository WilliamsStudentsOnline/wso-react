import createRouter from "router5";
import browserPlugin from "router5-plugin-browser";
import routes from "./routes";

export default function configureRouter() {
  const router = createRouter(routes, {
    allowNotFound: true,
    trailingSlashMode: "never",
    caseSensitive: false,
  });

  router.usePlugin(browserPlugin());
  return router;
}
