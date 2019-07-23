import { createLogger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers";

import { router5Middleware } from "redux-router5";

export default function configureStore(router, initialState = {}) {
  const createStoreWithMiddleware = applyMiddleware(
    router5Middleware(router),
    createLogger()
  )(createStore);

  const store = createStoreWithMiddleware(rootReducer, initialState);

  window.store = store;
  return store;
}
