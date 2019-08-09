import store from "../store";

import { actions } from "redux-router5";

// Returns true if there is no error and the status is OK
const checkAndHandleError = (response) => {
  if (response && response.status) {
    switch (response.status) {
      case 200: // GET request succeded
        return true;
      case 201: // PATCH request updated
        return true;
      case 500:
        return store.dispatch(actions.navigateTo("500"));
      default:
        return false;
    }
  }
  // handle error
  return false;
};

// eslint-disable-next-line
export { checkAndHandleError };
