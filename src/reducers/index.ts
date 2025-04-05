import courseReducer from "./course";
import schedulerUtilReducer from "./schedulerUtils";
import authReducer from "../lib/authSlice";
import goodrichReducer from "./goodrich";
import majorRequirementsReducer from "./majorRequirements";

const rootReducer = {
  courseState: courseReducer,
  schedulerUtilState: schedulerUtilReducer,
  authState: authReducer,
  goodrichState: goodrichReducer,
  majorRequirementsState: majorRequirementsReducer,
};

export default rootReducer;
export {
  courseReducer,
  schedulerUtilReducer,
  authReducer,
  goodrichReducer,
  majorRequirementsReducer,
};
