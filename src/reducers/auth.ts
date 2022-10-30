import {
  UPDATE_API_TOKEN,
  REMOVE_CREDS,
  UPDATE_IDEN_TOKEN,
  UPDATE_REMEMBER,
  UPDATE_USER,
  UPDATE_WSO,
} from "../constants/actionTypes";
import { API, NoAuthentication, WSO } from "wso-api-client";
import { createReducer } from "@reduxjs/toolkit";

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

const authReducer = createReducer(INITIAL_STATE, (builder) => {
  builder
    // Remove authentication credentials from storage
    .addCase(REMOVE_CREDS, () => {
      return INITIAL_STATE;
    })
    // Updates the identity token
    .addCase(UPDATE_IDEN_TOKEN, (state, action) => {
      const token = action.payload;

      return {
        ...state,
        identityToken: token,
      };
    })
    // Updates the token in the store. Checking of a error-free response should be done before this function call.
    .addCase(UPDATE_API_TOKEN, (state, action) => {
      const token = action.payload;
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
    })
    // Updates the user
    .addCase(UPDATE_USER, (state, action) => {
      const newUser = action.payload;

      // Extract only certain fields
      const currUser = {
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
    })
    // Updates the boolean indicating if user info should be stored
    .addCase(UPDATE_REMEMBER, (state, action) => {
      return { ...state, remember: action.payload };
    })
    // Updates the WSO object used for wso calls
    .addCase(UPDATE_WSO, (state, action) => {
      return { ...state, wso: action.payload };
    });
});

export default authReducer;
