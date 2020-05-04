// React imports
import React from "react";
import ReactDOM from "react-dom";

// Component/Stylesheet imports
import App from "./components/App";
import "./index.css";
import "./components/stylesheets/i.css";
import "typeface-source-sans-pro";

// Redux/store imports
import configureStore from "./store";
import { Provider } from "react-redux";
import { loadState, saveState } from "./loadState";

// Router imports
import { RouterProvider } from "react-router5";
import configureRouter from "./create-router";
import setUpRouterPermissions from "./router-permissions";

// Serviceworker import
import * as serviceWorker from "./serviceWorker";

// External imports
import throttle from "lodash/throttle";
import ReactGA from "react-ga";

const router = configureRouter();

if (process.env.NODE_ENV === "production") {
  ReactGA.initialize("UA-150865220-1");
  router.usePlugin(() => {
    return {
      onTransitionSuccess: (toState) => {
        ReactGA.set({ page: toState.path });
        ReactGA.pageview(toState.path);
      },
    };
  });
}

// TODO look at this
// const persistedAuthState = loadState("state");
const persistedSchedulerOptions = loadState("schedulerOptions");
const store = configureStore(router, { ...persistedSchedulerOptions });

store.subscribe(
  throttle(() => {
    const authState = store.getState().authState;
    const schedulerUtilState = store.getState().schedulerUtilState;
    saveState("state", { authState }, authState.remember);
    saveState(
      "schedulerOptions",
      {
        schedulerUtilState: {
          ...schedulerUtilState,
          gapi: null,
          notifications: [],
        },
      },
      true
    );
  }, 1000)
);

setUpRouterPermissions(router, store);

const wrappedApp = (
  <Provider store={store}>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </Provider>
);

router.start(() => {
  ReactDOM.render(wrappedApp, document.getElementById("root"));
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
