import { API, NoAuthentication, WSO } from "wso-api-client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import jwtDecode from "jwt-decode";
import type { User, WSOToken } from "../lib/types";
import { RootState } from "../lib/store";

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

const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
    removeCredentials: (state) => {
      state = INITIAL_STATE;
    },
    updateIdentityToken: (state, action: PayloadAction<string>) => {
      state.identityToken = action.payload;
    },
    updateAPIToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      const decoded = parseToken(token);

      if (decoded === null) {
        return; // do not change state
      }

      state.scope = decoded.scope;
      state.apiToken = token;
      state.expiry = (decoded.exp as number) * 1000; // Convert to milliseconds. Note that exp should always be defined.
      state.tokenLevel = decoded.tokenLevel;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const newUser = action.payload;

      // Extract only certain fields
      state.currUser = {
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
    },
    updateRemember: (state, action: PayloadAction<boolean>) => {
      state.remember = action.payload;
    },
    updateWSO: (state, action: PayloadAction<WSO>) => {
      state.wso = action.payload;
    },
  },
});

// actions
export const {
  removeCredentials,
  updateIdentityToken,
  updateAPIToken,
  updateUser,
  updateRemember,
  updateWSO,
} = authSlice.actions;

// selectors
export const getAPIToken = (state: RootState) => state.authState.apiToken;
export const getCurrUser = (state: RootState) => state.authState.currUser;
export const getExpiry = (state: RootState) => state.authState.expiry;
export const getIdentityToken = (state: RootState) =>
  state.authState.identityToken;
export const getScopes = (state: RootState) => state.authState.scope;
export const getTokenLevel = (state: RootState) => state.authState.tokenLevel;
export const getWSO = (state: RootState) => state.authState.wso;

// reducer
export default authSlice.reducer;
