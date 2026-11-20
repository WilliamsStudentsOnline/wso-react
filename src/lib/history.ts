// Note that we should not add "@remix-run/router" to the "dependencies" in the package.json file.
// Instead we should use the nested-dependency from the "react-router-dom" package.
// Read https://reactrouter.com/docs/en/v6/routers/history-router
// eslint-disable-next-line import/no-extraneous-dependencies
import { createBrowserHistory } from "@remix-run/router";

const history = createBrowserHistory();

export default history;
