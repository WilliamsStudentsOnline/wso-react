const getCurrSubMenu = ({ schedulerUtilState }) => schedulerUtilState.active;
const getGAPI = ({ schedulerUtilState }) => schedulerUtilState.gapi;
const getNotifications = ({ schedulerUtilState }) =>
  schedulerUtilState.notifications;
const getSemester = ({ schedulerUtilState }) => schedulerUtilState.semester;
const getTimeFormat = ({ schedulerUtilState }) => schedulerUtilState.twelveHour;
const getOrientation = ({ schedulerUtilState }) =>
  schedulerUtilState.horizontal;

export {
  getCurrSubMenu,
  getGAPI,
  getNotifications,
  getSemester,
  getTimeFormat,
  getOrientation,
};
