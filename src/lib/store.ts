import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import {
  courseReducer,
  schedulerUtilReducer,
  authReducer,
  utilReducer,
} from "../reducers";

const persistedAuthReducer = persistReducer(
  { key: "auth", storage, whitelist: ["identityToken"] },
  authReducer
);

const persistedCourseSchedulerReducer = persistReducer(
  { key: "courseScheduler", storage, blacklist: ["gapi", "notifications"] },
  schedulerUtilReducer
);

const store = configureStore({
  reducer: {
    courseState: courseReducer,
    schedulerUtilState: persistedCourseSchedulerReducer,
    authState: persistedAuthReducer,
    utilState: utilReducer,
  },
  // this is to disable React Toolkit's error message "A non-serializable value was detected in the state"
  // TODO: stop using non-serializable object `wso` and `authState.wso`
  // Read https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // redux-persist actions
        ignoredActionPaths: ["wso", "gapi"],
        ignoredPaths: ["authState.wso", "schedulerUtilState.gapi"],
      },
      // otherwise courseSchduler would result in `(InternalError): too much recursion`
      // See https://stackoverflow.com/questions/65217815/
      immutableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
export const persistor = persistStore(store);
