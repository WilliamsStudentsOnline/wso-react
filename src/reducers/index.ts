import courseReducer from "./course";
import schedulerUtilReducer from "./schedulerUtils";
import authReducer from "./authSlice";
import utilReducer from "./utils";
import goodrichReducer from "./goodrich";

const rootReducer = {
  courseState: courseReducer,
  schedulerUtilState: schedulerUtilReducer,
  authState: authReducer,
  utilState: utilReducer,
  goodrichState: goodrichReducer,
};

export default rootReducer;
export {
  courseReducer,
  schedulerUtilReducer,
  authReducer,
  utilReducer,
  goodrichReducer,
};
