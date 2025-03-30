import { SELECT_MAJOR } from "../constants/actionTypes";

const INITIAL_STATE = {
  selectedMajor: "",
};

export const doSelectMajor = (majorName) => ({
  type: SELECT_MAJOR,
  payload: majorName,
});

export const doClearMajor = () => ({
  type: SELECT_MAJOR,
  payload: "",
});

const majorRequirementsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SELECT_MAJOR:
      return {
        ...state,
        selectedMajor: action.payload, // Payload is the major name (string)
      };
    default:
      return state;
  }
};

export default majorRequirementsReducer;
