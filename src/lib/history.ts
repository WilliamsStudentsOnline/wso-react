// react-router v7 ships the history implementation that unstable_HistoryRouter
// expects; see https://reactrouter.com/api/declarative-routers/unstable_HistoryRouter
import { UNSAFE_createBrowserHistory as createBrowserHistory } from "react-router";

// v5Compat makes push/replace notify listeners; without it HistoryRouter only
// re-renders on back/forward, so Link clicks change the URL but not the page
const history = createBrowserHistory({ v5Compat: true });

export default history;
