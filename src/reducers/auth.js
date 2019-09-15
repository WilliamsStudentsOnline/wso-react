import {
  UPDATE_TOKEN,
  UPDATE_USER,
  REMOVE_CREDS,
  UPDATE_REMEMBER,
} from "../constants/actionTypes";

import jwtDecode from "jwt-decode";

const INITIAL_STATE = {
  scope: [],
  token: "",
  expiry: "",
  currUser: null, // Stores the user object.
  remember: false,
};

// Method to get scopes.
const parseToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    return null;
  }
};

// Updates the token in the store. Checking of a error-free response should be done before this
// function call.
// @TODO test this method with more sample responses
const updateToken = (state, action) => {
  const response = action.response;
  const decoded = parseToken(response.token);
  console.log(decoded);

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

// Updates the boolean indicating if user info should be stored
const updateRemember = (state, action) => {
  return Object.assign({}, state, {
    remember: action.remember,
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
    case UPDATE_REMEMBER:
      return updateRemember(state, action);
    default:
      return state;
  }
}

export default authReducer;
