import courseReducer from "./course";
import schedulerUtilReducer from "./schedulerUtils";
import authReducer from "../lib/authSlice";
import majorRequirementsReducer from "./majorRequirements";

const rootReducer = {
  courseState: courseReducer,
  schedulerUtilState: schedulerUtilReducer,
  authState: authReducer,
  majorRequirementsState: majorRequirementsReducer,
};

export default rootReducer;
export {
  courseReducer,
  schedulerUtilReducer,
  authReducer,
  majorRequirementsReducer,
};
