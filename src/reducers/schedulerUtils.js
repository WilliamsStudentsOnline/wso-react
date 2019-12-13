import {
  SUBMENU_CHANGE,
  UPDATE_GAPI,
  UPDATE_SIGNIN,
  ADD_NOTIF,
  REMOVE_NOTIF,
  CHANGE_SEMESTER,
  CHANGE_TIME_FORMAT,
  TOGGLE_ORIENTATION,
} from "../constants/actionTypes";

import { addDays } from "../lib/general";
import { DATES } from "../constants/constants.json";

/* 
  Set default semester based on date. 
  
  Academic year Period: SEMESTER TO SHOW

  1. Start of Fall Semester - 2 Weeks before Spring Preregistration: FALL
  2. 2 Weeks before Spring Pre-registration to Winter Registration: SPRING
  3. Winter Registration to 1 week before Winter ends: WINTER
  4. 1 week before Winter ends to 2 Weeks before Fall Pre-registration: SPRING
  5. 2 Weeks before Fall Pre-registration to next year: FALL
*/
let DEFAULT_SEMESTER = 0;
const now = new Date();
// Check if Winter (Period 3, above)
if (
  new Date(DATES.PREREG.WINTER) < now &&
  now < addDays(new Date(DATES.Winter.END), -7)
) {
  DEFAULT_SEMESTER = 1;
} else if (
  // Check if Spring (Periods 2 and 4, above)
  addDays(new Date(DATES.PREREG.SPRING), -14) < now &&
  now < addDays(new Date(DATES.PREREG.FALL), -14)
) {
  DEFAULT_SEMESTER = 2;
} else {
  DEFAULT_SEMESTER = 0;
}

const INITIAL_STATE = {
  active: "Timetable",
  gapi: null,
  signedIn: false,
  notifications: [],
  semester: DEFAULT_SEMESTER,
  twelveHour: true,
  horizontal: true,
};

const changeActive = (state, action) => {
  return { ...state, active: action.newState };
};

const updateGapi = (state, action) => {
  return { ...state, gapi: action.gapi };
};

const updateSignInStatus = (state, action) => {
  return { ...state, signedIn: action.signedIn };
};

const addNotification = (state, action) => {
  return {
    ...state,
    notifications: [...state.notifications, action.notification],
  };
};

const removeNotification = (state, action) => {
  return {
    ...state,
    notifications: state.notifications.filter((notification) => {
      return (
        notification.title !== action.notification.title &&
        notification.body !== action.notification.body
      );
    }),
  };
};

const changeSemester = (state, action) => {
  return { ...state, semester: action.semester };
};

const changeTimeFormat = (state, action) => {
  return { ...state, twelveHour: action.twelveHour };
};

const toggleOrientation = (state) => {
  return { ...state, horizontal: !state.horizontal };
};

function schedulerUtilReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_GAPI:
      return updateGapi(state, action);
    case UPDATE_SIGNIN:
      return updateSignInStatus(state, action);
    case SUBMENU_CHANGE:
      return changeActive(state, action);
    case ADD_NOTIF:
      return addNotification(state, action);
    case REMOVE_NOTIF:
      return removeNotification(state, action);
    case CHANGE_SEMESTER:
      return changeSemester(state, action);
    case CHANGE_TIME_FORMAT:
      return changeTimeFormat(state, action);
    case TOGGLE_ORIENTATION:
      return toggleOrientation(state);
    default:
      return state;
  }
}

export default schedulerUtilReducer;
