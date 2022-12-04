import courseReducer from "./course";
import schedulerUtilReducer from "./schedulerUtils";
import authReducer from "../lib/authSlice";
import goodrichReducer from "./goodrich";

const rootReducer = {
  courseState: courseReducer,
  schedulerUtilState: schedulerUtilReducer,
  authState: authReducer,
  goodrichState: goodrichReducer,
};

export default rootReducer;
export { courseReducer, schedulerUtilReducer, authReducer, goodrichReducer };
