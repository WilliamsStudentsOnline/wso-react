import {
  SUBMENU_CHANGE,
  UPDATE_GAPI,
  ADD_NOTIF,
  REMOVE_NOTIF,
  CHANGE_SEMESTER,
  CHANGE_TIME_FORMAT,
  CHANGE_ORIENTATION,
  UPDATE_STATE,
} from "../constants/actionTypes";

const INITIAL_STATE = {
  active: "Timetable",
  gapi: null,
  notifications: [],
  semester: 0,
  twelveHour: true,
  horizontal: false,
};

const changeActive = (state, action) => {
  return { ...state, active: action.newState };
};

const updateGapi = (state, action) => {
  return { ...state, gapi: action.gapi };
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

const changeOrientation = (state, action) => {
  return { ...state, horizontal: action.horizontal };
};

const updateState = (state, action) => {
  return { ...state, ...action.newState };
};

function schedulerUtilReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_GAPI:
      return updateGapi(state, action);
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
    case CHANGE_ORIENTATION:
      return changeOrientation(state, action);
    case UPDATE_STATE:
      return updateState(state, action);
    default:
      return state;
  }
}

export default schedulerUtilReducer;
