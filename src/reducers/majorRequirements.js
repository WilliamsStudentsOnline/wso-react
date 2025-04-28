import { SELECT_MAJOR } from "../constants/actionTypes";

const INITIAL_STATE = {
  selectedMajors: ["", "", ""],
};

export const doSelectMajor = (majorName, idx) => ({
  type: SELECT_MAJOR,
  payload: majorName,
  index: idx,
});

export const doClearMajor = (idx) => ({
  type: SELECT_MAJOR,
  payload: "",
  index: idx,
});

const majorRequirementsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SELECT_MAJOR: {
      const newSelectedMajors = [...state.selectedMajors];
      newSelectedMajors[action.index] = action.payload;
      return {
        ...state,
        selectedMajors: newSelectedMajors,
      };
    }
    default:
      return state;
  }
};

export default majorRequirementsReducer;
