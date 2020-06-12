import createRouter from "router5";
import browserPlugin from "router5-plugin-browser";
import routes from "./routes";

/**
 * Configures the router with our default options. For more information,
 * see https://github.com/router5/router5/blob/master/docs/guides/router-options.md
 */
export default function configureRouter() {
  const router = createRouter(routes, {
    allowNotFound: true, // If true, Router emits a NOT_FOUND state
    trailingSlashMode: "never", // Determines if trailing slash is added on the path
    // autoCleanUp: true,
    // defaultRoute: 'home',
    // defaultParams: {},
    // queryParams: {               // How the following special cases are stringified.
    //    arrayFormat: 'default',   // Defaults to no brackets added.
    //    nullFormat: 'default',    // Defaults to stringified without equal sign or value
    //    booleanFormat: 'default'  // Defaults to string stringification
    // },
    // queryParamsMode: 'default',  // Paths match with any query parameters added, but when building,
    //                                 extra parameters won't appear in the returned path.
    // strictTrailingSlash: false,  // Determines if trailing slashes are important to access url
    // caseSensitive: false,        // Case Sensitivity of route matching
    // urlParamsEncoding: 'default' // Encoding/Decoding of URL params when performing path matching
  });

  router.usePlugin(browserPlugin());
  return router;
}
