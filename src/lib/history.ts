// Note that we should not add "history" to the "dependencies" in the package.json file.
// Instead we should use the nested-dependency "history" from the "react-router-dom" package.
// Read https://reactrouter.com/docs/en/v6/routers/history-router
// eslint-disable-next-line import/no-extraneous-dependencies
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export default history;
