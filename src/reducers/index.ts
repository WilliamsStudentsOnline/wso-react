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

export interface RootState {
  courseState: ReturnType<typeof courseReducer>;
  schedulerUtilState: ReturnType<typeof schedulerUtilReducer>;
  authState: ReturnType<typeof authReducer>;
  goodrichState: ReturnType<typeof goodrichReducer>;
  featureFlagState: ReturnType<typeof featureFlagReducer>;
}

export default rootReducer;
export {
  courseReducer,
  schedulerUtilReducer,
  authReducer,
  goodrichReducer,
  featureFlagReducer,
};
