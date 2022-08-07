// React imports
import React from "react";
import ReactDOM from "react-dom";

// Component/Stylesheet imports
import App from "./components/App";
import "./components/stylesheets/Colors.css";
import "./index.css";
import "./components/stylesheets/i.css";
import "typeface-source-sans-pro";

// Redux/store imports
import { Provider } from "react-redux";
import { saveState } from "./stateStorage";
import store from "./lib/store";
// Router imports
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import history from "./lib/history";

// Serviceworker import
import * as serviceWorker from "./serviceWorker";

// This code might not work if "this" is used. Test it.
function throttle(callback, limit) {
  let waiting = false; // Initially, we're not waiting
  return function func(...args) {
    // We return a throttled function
    if (!waiting) {
      // If we're not waiting
      callback.apply(this, args); // Execute users function
      waiting = true; // Prevent future invocations
      setTimeout(() => {
        // After a period of time
        waiting = false; // And allow future invocations
      }, limit);
    }
  };
}

/**
 * Saves the user data in the appropriate storage depending on user's preferences.
 *
 * @param store - The redux store that holds our state.
 */
// TODO: better store persistence
const saveUserData = (reduxStore) => {
  const authState = reduxStore.getState().authState;
  const schedulerUtilState = reduxStore.getState().schedulerUtilState;
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
// const router = configureRouter();
// initializeAnalytics(router);

// TODO: before save, should read first.
// TODO: it seems that throttling makes it unable to immediately store changes after they are made
store.subscribe(throttle(() => saveUserData(store), 1000));
// store.subscribe((() => saveUserData(store)));

// setUpRouterPermissions(router, store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HistoryRouter history={history}>
        <App />
      </HistoryRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
