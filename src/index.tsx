// React imports
import React from "react";
import { createRoot } from "react-dom/client";

// Component/Stylesheet imports
import App from "./components/App";
import "./components/ui/tokens.css";
import "./components/stylesheets/Colors.css";
import "./index.css";
import "./components/stylesheets/i.css";

// Redux/store imports
import { Provider } from "react-redux";
import store, { persistor } from "./lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { injectStore } from "./lib/axiosAuth";
import { ThemeProvider } from "./lib/ThemeProvider";

// Router imports
import { unstable_HistoryRouter as HistoryRouter } from "react-router";
import history from "./lib/history";

// Serviceworker import
import * as serviceWorker from "./serviceWorker";

injectStore(store);

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <HistoryRouter history={history}>
            <App />
          </HistoryRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
