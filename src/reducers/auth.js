import {
  UPDATE_TOKEN,
  UPDATE_USER,
  REMOVE_CREDS,
  UPDATE_REMEMBER,
  UPDATE_API,
} from "../constants/actionTypes";
import { WSO, API, NoAuthentication } from "wso-api-client";

import jwtDecode from "jwt-decode";

// TODO edit this for prod
const API_CLIENT = new WSO(
  new API("http://localhost:8080", new NoAuthentication())
);

const INITIAL_STATE = {
  scope: [],
  token: "",
  expiry: 0,
  currUser: null, // Stores the user object.
  remember: false,
  tokenLevel: 0,
  api: API_CLIENT,
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
const updateToken = (state, action) => {
  const token = action.token;
  const decoded = parseToken(token);

  return {
    ...state,
    scope: decoded.scope,
    token,
    expiry: decoded.exp * 1000,
    tokenLevel: decoded.tokenLevel,
  };
};

// Updates the user
const updateUser = (state, action) => {
  return { ...state, currUser: action.newUser };
};

// Updates the boolean indicating if user info should be stored
const updateRemember = (state, action) => {
  return { ...state, remember: action.remember };
};

// Updates the API object used for API calls
const updateAPI = (state, action) => {
  return { ...state, api: action.api };
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
    case UPDATE_API:
      return updateAPI(state, action);
    default:
      return state;
  }
}

export default authReducer;
