import {
  UPDATE_TOKEN,
  UPDATE_USER,
  REMOVE_CREDS,
} from "../constants/actionTypes";

import jwtDecode from "jwt-decode";

const INITIAL_STATE = {
  scope: [],
  token: "",
  expiry: "",
  currUser: null, // Stores the user object.
};

// Method to get scopes.
const parseToken = (token) => {
  const decoded = jwtDecode(token);
  return decoded;
  // @TODO: Error handling
};

// Updates the token in the store. Checking of a error-free response should be done before this
// function call.
// @TODO test this method with more sample responses
const updateToken = (state, action) => {
  const response = action.response;
  const decoded = parseToken(response.token);

  return Object.assign({}, state, {
    scope: decoded.scope,
    token: response.token,
    expiry: response.expire,
  });
};

// Updates the user
const updateUser = (state, action) => {
  return Object.assign({}, state, {
    currUser: action.newUser,
  });
};

// Remove authentication credentials from storage
const removeCreds = () => {
  return INITIAL_STATE;
};

function authReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_TOKEN:
      return updateToken(state, action);
    case UPDATE_USER:
      return updateUser(state, action);
    case REMOVE_CREDS:
      return removeCreds();
    default:
      return state;
  }
}

export default authReducer;
