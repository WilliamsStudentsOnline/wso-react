import authReducer, { DEFAULT_API_CLIENT, INITIAL_STATE } from "./authSlice";

import type { AuthState } from "./authSlice";
import type { User } from "./types";
import type { RootState } from "./store";
import { API, SimpleAuthentication, WSO } from "wso-api-client";

// reducers
import {
  removeCredentials,
  updateIdentityToken,
  updateAPIToken,
  updateUser,
  updateRemember,
} from "./authSlice";

// actions
import {
  getAPIToken,
  getCurrUser,
  getExpiry,
  getIdentityToken,
  getScopes,
  getTokenLevel,
  getWSO,
} from "./authSlice";

describe("Authentication Selector", () => {
  const INITIAL_ROOT_STATE: RootState = {
    authState: {
      apiToken: "apiToken",
      identityToken: "identityToken",
      scope: ["a scope"],
      expiry: 1230,
      tokenLevel: 3,
      currUser: { id: 12579, unixID: "ys5" },
      remember: false,
      wso: DEFAULT_API_CLIENT,
    },
  } as RootState;

  it("retrieves current user", () => {
    const currentUser = getCurrUser(INITIAL_ROOT_STATE);
    expect(currentUser).toEqual({ id: 12579, unixID: "ys5" });
  });

  it("retrieves expiration", () => {
    const expiry = getExpiry(INITIAL_ROOT_STATE);
    expect(expiry).toEqual(1230);
  });

  it("retrieves token level", () => {
    const tokenLevel = getTokenLevel(INITIAL_ROOT_STATE);
    expect(tokenLevel).toEqual(3);
  });

  it("retrieves api token", () => {
    const token = getAPIToken(INITIAL_ROOT_STATE);
    expect(token).toEqual("apiToken");
  });

  it("retrieves identity token", () => {
    const token = getIdentityToken(INITIAL_ROOT_STATE);
    expect(token).toEqual("identityToken");
  });

  it("retrieves user scope", () => {
    const scopes = getScopes(INITIAL_ROOT_STATE);
    expect(scopes).toEqual(["a scope"]);
  });

  it("retrieves WSO client instance", () => {
    const wso = getWSO(INITIAL_ROOT_STATE);
    expect(wso).toEqual(DEFAULT_API_CLIENT);
  });
});

describe("Authentication Reducer", () => {
  it("returns the initial state on initialization", () => {
    // Arrange
    const previousState = undefined;
    const action = { type: undefined };

    // Act
    const result = authReducer(previousState, action);

    // Assert
    expect(result).toEqual(INITIAL_STATE);
  });

  it("updates api token and parses scope, expiry, and token level", () => {
    const previousState: AuthState = {
      ...INITIAL_STATE,
      scope: [],
      identityToken: "identityToken",
      expiry: 0,
      tokenLevel: 0,
    };
    // deepFreeze(previousState);

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzUxMzk2MTQsImlkIjoyLCJvcmlnX2lhdCI6MTU3NDUzNDgxNCwic2NvcGUiOlsic2VydmljZTpidWxsZXRpbiIsInNlcnZpY2U6dXNlcnMiLCJzZXJ2aWNlOm90aGVyIiwid3JpdGU6c2VsZiIsInNlcnZpY2U6ZmFjdHJhazpmdWxsIiwic2VydmljZTpkb3JtdHJhayIsInNlcnZpY2U6ZG9ybXRyYWs6d3JpdGUiLCJhZG1pbjphbGwiLCJzZXJ2aWNlOmZhY3RyYWs6YWRtaW4iXSwidG9rZW5MZXZlbCI6M30.Yahci9wBOYSzSVYP5An3RQwQkuBPaE-MhiowNG539v4";
    const changedState = authReducer(previousState, updateAPIToken(token));

    const expectedNewState = {
      ...INITIAL_STATE,
      apiToken: token,
      identityToken: "identityToken",
      tokenLevel: 3,
      expiry: 1575139614000,
      scope: [
        "service:bulletin",
        "service:users",
        "service:other",
        "write:self",
        "service:factrak:full",
        "service:dormtrak",
        "service:dormtrak:write",
        "admin:all",
        "service:factrak:admin",
      ],
    };

    // Check that the API instance has been updated
    expect(changedState.wso).not.toEqual(INITIAL_STATE.wso);
    const changedStateWithOutWSO = { ...changedState, wso: INITIAL_STATE.wso };

    // Check that the token is correctly parsed and stored into state
    expect(changedStateWithOutWSO).toEqual(expectedNewState);
  });

  it("updates whether to remember user", () => {
    const previousState = { ...INITIAL_STATE, remember: false };
    // deepFreeze(previousState);

    const action = updateRemember(true);
    const changedState = authReducer(previousState, action);

    const expectedNewState = { ...INITIAL_STATE, remember: true };
    expect(changedState).toEqual(expectedNewState);
  });

  it("updates identityToken", () => {
    const previousState = {
      ...INITIAL_STATE,
      identityToken: "oldIdentityToken",
    };
    // deepFreeze(previousState);

    const newIdentityToken = "newIdentityToken";
    const action = updateIdentityToken(newIdentityToken);
    const changedState = authReducer(previousState, action);

    const expectedNewState = {
      ...INITIAL_STATE,
      identityToken: newIdentityToken,
    };
    expect(changedState).toEqual(expectedNewState);
  });

  it("removes credentials", () => {
    const previousState = {
      ...INITIAL_STATE,
      apiToken: "apiToken",
      currUser: { id: 12579, unixID: "ys5" },
      expiry: 123812930,
      identityToken: "identityToken",
      remember: false,
      scope: ["service:bulletin", "service:users", "service:other"],

      tokenLevel: 3,
      wso: DEFAULT_API_CLIENT,
    };
    // deepFreeze(previousState);

    const action = removeCredentials;
    const changedState = authReducer(previousState, action);

    const expectedNewState = {
      ...INITIAL_STATE,
      apiToken: "",
      currUser: null,
      expiry: 0,
      identityToken: "",
      remember: false,
      scope: [],
      tokenLevel: 0,
      wso: DEFAULT_API_CLIENT,
    };
    expect(changedState).toEqual(expectedNewState);
  });

  it("updates user", () => {
    const previousState = {
      ...INITIAL_STATE,
      scope: [],
      token: "",
      expiry: 0,
      currUser: null, // Stores the user object.
      remember: false,
      tokenLevel: 0,
    };
    // deepFreeze(previousState);

    const user: User = {
      admin: false,
      // dorm: {
      //   id: 5,
      //   name: "Parsons",
      //   neighborhoodID: 15,
      // },
      // dormRoom: {
      //   number: "101",
      //   id: 10,
      // },
      dormRoomID: 12,
      dormVisible: true,
      factrakAdmin: false,
      factrakSurveyDeficit: 2,
      hasAcceptedDormtrakPolicy: true,
      hasAcceptedFactrakPolicy: true,
      homeVisible: false,
      id: 2,
      offCycle: false,
      pronoun: "",
      type: "student",
      unixID: "admin",
      visible: true,
      cellPhone: "1234567890",
    };
    const action = updateUser(user);
    const changedState = authReducer(previousState, action);

    const expectedNewState = {
      ...INITIAL_STATE,
      scope: [],
      token: "",
      expiry: 0,
      currUser: user,
      remember: false,
      tokenLevel: 0,
    };
    expect(changedState).toEqual(expectedNewState);
  });
});
