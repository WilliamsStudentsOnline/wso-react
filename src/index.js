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

// Serviceworker import
import * as serviceWorker from "./serviceWorker";

// External imports
import throttle from "lodash/throttle";

const router = configureRouter();

const persistedState = loadState();
const store = configureStore(router, persistedState);

store.subscribe(
  throttle(() => {
    const authState = store.getState().authState;
    saveState({ authState });

    // @TODO: Saving state in between tabs but not across sessions -> absolutely no idea how.
    // if (authState.remember) {
    //   saveState({ authState });
    // } else {
    //   saveState({
    //     authState: {
    //       scope: [],
    //       token: "",
    //       expiry: "",
    //       currUser: null, // Stores the user object.
    //       remember: false,
    //     },
    //   });
    // }
  }, 1000)
);

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
