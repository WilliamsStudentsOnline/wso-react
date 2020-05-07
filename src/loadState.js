import configureStore from "./store";
import { doUpdateToken, doUpdateAPI, doUpdateUser } from "./actions/auth";
import { SimpleAuthentication } from "wso-api-client";

export const loadState = (stateName) => {
  try {
    let serializedState = localStorage.getItem(stateName);
    // If no saved state found return undefined.
    // Note that you cannot return null, because an undefined input
    // causes the second argument to be treated as empty, whereas
    // a null input causes the second argument to be treated as null
    if (serializedState === null) {
      serializedState = sessionStorage.getItem(stateName);
      if (serializedState === null) {
        return undefined;
      }
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (stateName, state, useLocalStorage) => {
  try {
    const serializedState = JSON.stringify(state);
    if (useLocalStorage) {
      localStorage.setItem(stateName, serializedState);
    } else {
      sessionStorage.setItem(stateName, serializedState);
    }
  } catch (err) {
    // Ignore write errors.
  }
};

/**
 * Loads the user information into the store based on the token. The
 * loading process will only be complete if we are able to get the user information,
 * and will be abandoned otherwise.
 * This is made into an async function to be a non-blocking operation for the rest
 * of the screen rendering.
 * @param {Store} store store to load information to.
 * @param {string} token user token
 */
const loadUserInfo = async (store, token) => {
  store.dispatch(doUpdateToken(token));
  const updatedAuth = new SimpleAuthentication(token);
  const updatedAPI = store.getState().authState.api.updateAuth(updatedAuth);

  // Only update the token and user if we are able to get the user response;
  try {
    const userResponse = await updatedAPI.userService.getUser("me");
    store.dispatch(doUpdateUser(userResponse.data));
    store.dispatch(doUpdateAPI(updatedAPI));
    store.dispatch(doUpdateToken(token));
  } catch {
    // do nothing
  }
};

export const loadWSOState = (router) => {
  const persistedSchedulerOptions = loadState("schedulerOptions");
  const store = configureStore(router, {
    ...persistedSchedulerOptions,
  });

  const persistedToken = loadState("token");

  if (persistedToken) {
    loadUserInfo(store, persistedToken);
  }

  return store;
};
