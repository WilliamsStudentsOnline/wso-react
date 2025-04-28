import {
  SUBMENU_CHANGE,
  UPDATE_GAPI,
  ADD_NOTIF,
  REMOVE_NOTIF,
  CHANGE_SEMESTER,
  CHANGE_TIME_FORMAT,
  CHANGE_ORIENTATION,
  UPDATE_STATE,
  UPDATE_MAJOR_BUILDER_STATE,
} from "../constants/actionTypes";

const doSubmenuChange = (newState) => ({
  type: SUBMENU_CHANGE,
  newState,
});

const updateGAPI = (gapi) => ({
  type: UPDATE_GAPI,
  gapi,
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

const doUpdateSchedulerState = (newState) => ({
  type: UPDATE_STATE,
  newState,
});

const doUpdateMajorBuilderState = (newState) => ({
  type: UPDATE_MAJOR_BUILDER_STATE,
  newState,
});

export {
  addNotif,
  changeOrientation,
  changeSem,
  changeTimeFormat,
  doSubmenuChange,
  removeNotif,
  updateGAPI,
  doUpdateSchedulerState,
  doUpdateMajorBuilderState,
};
