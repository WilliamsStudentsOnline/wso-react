import courseReducer from "./course";
import schedulerUtilReducer from "./schedulerUtils";
import authReducer from "./auth";
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
