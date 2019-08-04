import { UPDATE_TOKEN, UPDATE_USER } from "../constants/actionTypes";

import jwtDecode from "jwt-decode";

const INITIAL_STATE = {
  scope: [],
  token: "",
  expiry: "",
  currUser: null, // Stores the user object. @TODO examine if storing the unix ID will be better.
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
  console.log(response);
  const decoded = parseToken(response.data.data.token);
  console.log(decoded);

  return Object.assign({}, state, {
    scope: decoded.scope,
    token: response.data.data.token,
    expiry: response.data.data.expire,
  });
};

// Updates the user
const updateUser = (state, action) => {
  return Object.assign({}, state, {
    currUser: action.newUser,
  });
};

function authReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_TOKEN:
      return updateToken(state, action);
    case UPDATE_USER:
      return updateUser(state, action);
    default:
      return state;
  }
}

export default authReducer;
