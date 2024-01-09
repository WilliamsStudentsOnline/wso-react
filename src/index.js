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
import store, { persistor } from "./lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { injectStore } from "./lib/axiosAuth";

// Router imports
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import history from "./lib/history";

// Serviceworker import
import * as serviceWorker from "./serviceWorker";

// FeatureFlag imports
import { FeatureFlagsProvider } from "./components/FeatureFlags";

injectStore(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HistoryRouter history={history}>
          <FeatureFlagsProvider>
            <App />
          </FeatureFlagsProvider>
        </HistoryRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
