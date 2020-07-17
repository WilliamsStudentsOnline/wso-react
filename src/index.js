// React imports
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

// Component/Stylesheet imports
import "typeface-nunito";
import "typeface-source-sans-pro";
import "./eui_theme_wso.scss";
import "./index.scss";

// Redux/store imports
import { Provider } from "react-redux";
import { saveState } from "./stateStorage";
import configureStore from "./store";

// Router imports
import { RouterProvider } from "react-router5";
import configureRouter from "./create-router";
import setUpRouterPermissions from "./router-permissions";

// Serviceworker import
import * as serviceWorker from "./serviceWorker";

// External imports
import throttle from "lodash/throttle";
import ReactGA from "react-ga";

const initializeAnalytics = (router) => {
  // Only set up analytics if we are in production to avoid data contamination
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
};

/**
 * Saves the user data in the appropriate storage depending on user's preferences.
 *
 * @param store - The redux store that holds our state.
 */
const saveUserData = (store) => {
  const authState = store.getState().authState;
  const schedulerUtilState = store.getState().schedulerUtilState;
  // Using this to override people's current authState
  if (authState.remember) {
    saveState("state", {
      authState: { identityToken: authState.identityToken },
    });
  }
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
};

/* Router and Store setup */
const router = configureRouter();
initializeAnalytics(router);

const store = configureStore(router);
store.subscribe(throttle(() => saveUserData(store), 1000));

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
