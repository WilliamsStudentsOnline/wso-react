import { combineReducers } from "redux";
import courseReducer from "./course";
import utilReducer from "./schedulerUtils";
import authReducer from "./auth";
import { router5Reducer } from "redux-router5";

const rootReducer = combineReducers({
  courseState: courseReducer,
  utilState: utilReducer,
  router: router5Reducer,
  authState: authReducer,
});

export default rootReducer;
