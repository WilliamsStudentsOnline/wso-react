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

const INITIAL_STATE = {
  active: "Timetable",
  gapi: null,
  signedIn: false,
  notifications: [],
  semester: 0,
  twelveHour: true,
  horizontal: true,
};

const changeActive = (state, action) => {
  return Object.assign({}, state, {
    active: action.newState,
  });
};

const updateGapi = (state, action) => {
  return Object.assign({}, state, {
    gapi: action.gapi,
  });
};

const updateSignInStatus = (state, action) => {
  return Object.assign({}, state, {
    signedIn: action.signedIn,
  });
};

const addNotification = (state, action) => {
  return Object.assign({}, state, {
    notifications: [...state.notifications, action.notification],
  });
};

const removeNotification = (state, action) => {
  return Object.assign({}, state, {
    notifications: state.notifications.filter((notification) => {
      return (
        notification.title !== action.notification.title &&
        notification.body !== action.notification.body
      );
    }),
  });
};

const changeSemester = (state, action) => {
  return Object.assign({}, state, {
    semester: action.semester,
  });
};

const changeTimeFormat = (state, action) => {
  return Object.assign({}, state, {
    twelveHour: action.twelveHour,
  });
};

const toggleOrientation = (state) => {
  return Object.assign({}, state, {
    horizontal: !state.horizontal,
  });
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
