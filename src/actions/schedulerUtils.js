import {
  SUBMENU_CHANGE,
  UPDATE_GAPI,
  UPDATE_SIGNIN,
  ADD_NOTIF,
  REMOVE_NOTIF,
  CHANGE_SEMESTER,
  CHANGE_TIME_FORMAT,
  CHANGE_ORIENTATION,
} from "../constants/actionTypes";

const doSubmenuChange = (newState) => ({
  type: SUBMENU_CHANGE,
  newState,
});

const updateGAPI = (gapi) => ({
  type: UPDATE_GAPI,
  gapi,
});

const updateSignIn = (signedIn) => ({
  type: UPDATE_SIGNIN,
  signedIn,
});

const addNotif = (notification) => ({
  type: ADD_NOTIF,
  notification,
});

const removeNotif = (notification) => ({
  type: REMOVE_NOTIF,
  notification,
});

const changeSem = (semester) => ({
  type: CHANGE_SEMESTER,
  semester,
});

const changeTimeFormat = (twelveHour) => ({
  type: CHANGE_TIME_FORMAT,
  twelveHour,
});

const changeOrientation = (horizontal) => ({
  type: CHANGE_ORIENTATION,
  horizontal,
});

export {
  doSubmenuChange,
  updateGAPI,
  updateSignIn,
  addNotif,
  removeNotif,
  changeSem,
  changeTimeFormat,
  changeOrientation,
};
