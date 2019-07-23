import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import configureStore from "./store";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router5";
import configureRouter from "./create-router";

const router = configureRouter();

const store = configureStore(router);

const wrappedApp = (
  <Provider store={store}>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </Provider>
);

router.start((err, state) => {
  ReactDOM.render(wrappedApp, document.getElementById("root"));
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
