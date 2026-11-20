// react-router v7 ships the history implementation that unstable_HistoryRouter
// expects; see https://reactrouter.com/api/declarative-routers/unstable_HistoryRouter
import { UNSAFE_createBrowserHistory as createBrowserHistory } from "react-router";

const history = createBrowserHistory();

export default history;
