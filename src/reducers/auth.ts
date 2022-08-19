import {
  UPDATE_API_TOKEN,
  REMOVE_CREDS,
  UPDATE_IDEN_TOKEN,
  UPDATE_REMEMBER,
  UPDATE_USER,
  UPDATE_WSO,
} from "../constants/actionTypes";
import { API, NoAuthentication, WSO } from "wso-api-client";
import { AnyAction, createReducer, Reducer } from "@reduxjs/toolkit";

import jwtDecode from "jwt-decode";
import type { User, WSOToken } from "../lib/types";

// const API_ADDRESS = "http://localhost:8080";

export const DEFAULT_API_CLIENT = new WSO(new API("", new NoAuthentication()));

export interface AuthState {
  apiToken: string;
  identityToken: string;
  scope: string[];
  expiry: number;
  tokenLevel: number;
  currUser: User | null;
  remember: boolean;
  wso: WSO;
}

const INITIAL_STATE: AuthState = {
  scope: [],
  identityToken: "",
  apiToken: "",
  expiry: 0,
  currUser: null, // Stores the user object.
  remember: false,
  tokenLevel: 0,
  wso: DEFAULT_API_CLIENT,
};

// Method to get scopes.
const parseToken = (token: string) => {
  try {
    const decoded = jwtDecode<WSOToken>(token);
    return decoded;
  } catch (error) {
    return null;
  }
};

// Updates the identity token
const updateIdenToken = (state: AuthState, action: AnyAction): AuthState => {
  const token = action.token as string;

  return {
    ...state,
    identityToken: token,
  };
};

// Updates the token in the store. Checking of a error-free response should be done before this
// function call.
const updateAPIToken = (state: AuthState, action: AnyAction): AuthState => {
  const token = action.token;
  const decoded = parseToken(token);

  if (decoded === null) {
    return state;
  }

  return {
    ...state,
    scope: decoded.scope,
    apiToken: token,
    expiry: (decoded.exp as number) * 1000, // Convert to milliseconds. Note that exp should always be defined.
    tokenLevel: decoded.tokenLevel,
  };
};

// Updates the user
const updateUser = (state: AuthState, action: AnyAction): AuthState => {
  const newUser = action.newUser;

  // Extract only certain fields
  const currUser: User = {
    id: newUser.id,
    admin: newUser.admin,
    unixID: newUser.unixID,
    dormRoomID: newUser.dormRoomID,
    hasAcceptedDormtrakPolicy: newUser.hasAcceptedDormtrakPolicy,
    type: newUser.type,
    pronoun: newUser.pronoun,
    visible: newUser.visible,
    homeVisible: newUser.homeVisible,
    dormVisible: newUser.dormVisible,
    offCycle: newUser.offCycle,
    factrakAdmin: newUser.factrakAdmin,
    hasAcceptedFactrakPolicy: newUser.hasAcceptedFactrakPolicy,
    factrakSurveyDeficit: newUser.factrakSurveyDeficit,
    williamsID: newUser.williamsID,
    cellPhone: newUser.cellPhone,
  };

  return { ...state, currUser };
};

// Updates the boolean indicating if user info should be stored
const updateRemember = (state: AuthState, action: AnyAction): AuthState => {
  return { ...state, remember: action.remember };
};

// Updates the WSO object used for wso calls
const updateWSO = (state: AuthState, action: AnyAction): AuthState => {
  return { ...state, wso: action.wso };
};

// Remove authentication credentials from storage
const removeCreds = () => {
  return INITIAL_STATE;
};

const authReducer: Reducer<AuthState, AnyAction> = (
  state = INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case REMOVE_CREDS:
      return removeCreds();
    case UPDATE_API_TOKEN:
      return updateAPIToken(state, action);
    case UPDATE_IDEN_TOKEN:
      return updateIdenToken(state, action);
    case UPDATE_USER:
      return updateUser(state, action);
    case UPDATE_REMEMBER:
      return updateRemember(state, action);
    case UPDATE_WSO:
      return updateWSO(state, action);
    default:
      return state;
  }
};

// const todosReducer = createReducer(INITIAL_STATE, (builder) => {
//   builder
//     .addCase(REMOVE_CREDS, removeCreds)
//     .addCase(UPDATE_API_TOKEN, (state, action) => {
//       const token = action.token;
//       const decoded = parseToken(token);

//       if (decoded === null) {
//         return state;
//       }

//       return {
//         ...state,
//         scope: decoded.scope,
//         apiToken: token,
//         expiry: (decoded.exp as number) * 1000,  // Convert to milliseconds. Note that exp should always be defined.
//         tokenLevel: decoded.tokenLevel,
//       };
//     })
//     .addCase(REMOVE_CREDS, removeCreds)
//     .addCase(REMOVE_CREDS, removeCreds)
//     .addCase(REMOVE_CREDS, removeCreds)
//     .addCase('TOGGLE_TODO', (state, action) => {
//       const todo = state[action.payload.index]
//       // "mutate" the object by overwriting a field
//       todo.completed = !todo.completed
//     })
//     .addCase('REMOVE_TODO', (state, action) => {
//       // Can still return an immutably-updated value if we want to
//       return state.filter((todo, i) => i !== action.payload.index)
//     })
// })

export default authReducer;
