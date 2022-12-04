import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
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

import { courseReducer, schedulerUtilReducer, authReducer } from "../reducers";

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
  },
  // this is to disable React Toolkit's error message "A non-serializable value was detected in the state"
  // TODO: stop using non-serializable object `authState.wso` and `schedulerUtilState.gapi`
  // Read https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER, // all above are redux-persist actions
        ],
        ignoredActionPaths: ["gapi"],
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
