import { createLogger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";

import { router5Middleware } from "redux-router5";

export default function configureStore(router, initialState = {}) {
  let createStoreWithMiddleware;
  if (process.env.NODE_ENV === "development") {
    createStoreWithMiddleware = applyMiddleware(
      router5Middleware(router),
      createLogger()
    )(createStore);
  } else {
    createStoreWithMiddleware = applyMiddleware(router5Middleware(router))(
      createStore
    );
  }

  const store = createStoreWithMiddleware(rootReducer, initialState);

  window.store = store;
  return store;
}
