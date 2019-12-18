import { UPDATE_NOTICE, UPDATE_WARNING } from "../constants/actionTypes";

const INITIAL_STATE = {
  notices: [],
  warnings: [],
};

const updateNotice = (state, notice) => {
  return { ...state, notice };
};

const updateWarning = (state, warning) => {
  return { ...state, warning };
};

function utilReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_NOTICE:
      return updateNotice(state, action.notice);
    case UPDATE_WARNING:
      return updateWarning(state, action.warning);
    default:
      return state;
  }
}

export default utilReducer;
