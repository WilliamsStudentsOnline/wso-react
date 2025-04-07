import courseReducer from "./course";
import schedulerUtilReducer from "./schedulerUtils";
import authReducer from "../lib/authSlice";
import featureFlagReducer from "../lib/featureFlagSlice";

import goodrichReducer from "./goodrich";

const rootReducer = {
  courseState: courseReducer,
  schedulerUtilState: schedulerUtilReducer,
  authState: authReducer,
  goodrichState: goodrichReducer,
  featureFlagState: featureFlagReducer,
};

export default rootReducer;
export {
  courseReducer,
  schedulerUtilReducer,
  authReducer,
  goodrichReducer,
  featureFlagReducer,
};
