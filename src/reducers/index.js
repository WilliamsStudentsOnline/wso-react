import { combineReducers } from "redux";
import courseReducer from "./course";
import schedulerUtilReducer from "./schedulerUtils";
import authReducer from "./auth";
import utilReducer from "./utils";
import { router5Reducer } from "redux-router5";
import goodrichReducer from "./goodrich";

const rootReducer = combineReducers({
  courseState: courseReducer,
  schedulerUtilState: schedulerUtilReducer,
  router: router5Reducer,
  authState: authReducer,
  utilState: utilReducer,
  goodrichState: goodrichReducer,
});

export default rootReducer;
