const getCurrSubMenu = ({ utilState }) => utilState.active;
const getGAPI = ({ utilState }) => utilState.gapi;
const getSignInStatus = ({ utilState }) => utilState.signedIn;
const getNotifications = ({ utilState }) => utilState.notifications;
const getSemester = ({ utilState }) => utilState.semester;
const getTimeFormat = ({ utilState }) => utilState.twelveHour;
const getOrientation = ({ utilState }) => utilState.horizontal;

export {
  getCurrSubMenu,
  getGAPI,
  getSignInStatus,
  getNotifications,
  getSemester,
  getTimeFormat,
  getOrientation,
};
