import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducers";

const store = configureStore({
  reducer: rootReducer,
  // this is to disable React Toolkit's error message "A non-serializable value was detected in the state"
  // TODO: stop using non-serializable object `wso` and `authState.wso`
  // Read https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["wso", "gapi"],
        ignoredPaths: ["authState.wso", "schedulerUtilState.gapi"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
