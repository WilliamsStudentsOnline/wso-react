import store from "../store";

import { actions } from "redux-router5";
import { doUpdateToken, doUpdateUser } from "../actions/auth";
import { updateTokenAPI } from "../api/auth";
import { getUser } from "../api/users";

// Assumes a valid and error-free response
export const checkAndUpdateUser = async (response) => {
  if (response.data.updateToken) {
    const token = store.getState().authState.token;
    if (token === "") return;
    const updateResponse = await updateTokenAPI(token);
    if (updateResponse.status === 200) {
      store.dispatch(doUpdateToken(updateResponse.data.data));
      const userResponse = await getUser("me", token);
      if (userResponse.status === 200) {
        store.dispatch(doUpdateUser(userResponse.data.data));
      }
    }
  }
};

// Returns true if there is no error and the status is OK
export const checkAndHandleError = (response) => {
  if (response && response.status) {
    switch (response.status) {
      case 200: // GET request succeded
      case 201: // PATCH request updated
        checkAndUpdateUser(response);
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

// Capitalize the first letter of the string.
export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
