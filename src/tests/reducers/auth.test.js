import deepFreeze from "deep-freeze";
import utilReducer, { DEFAULT_API_CLIENT } from "../../reducers/authSlice";
import {
  REMOVE_CREDS,
  UPDATE_API_TOKEN,
  UPDATE_IDEN_TOKEN,
  UPDATE_USER,
  UPDATE_REMEMBER,
  UPDATE_WSO,
} from "../../constants/actionTypes";

describe("Authentication reducer", () => {
  test.only("palceholder", () => {
    expect(1).toEqual(1);
  });

  it("updates api token, scope, expiry, and token level", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzUxMzk2MTQsImlkIjoyLCJvcmlnX2lhdCI6MTU3NDUzNDgxNCwic2NvcGUiOlsic2VydmljZTpidWxsZXRpbiIsInNlcnZpY2U6dXNlcnMiLCJzZXJ2aWNlOm90aGVyIiwid3JpdGU6c2VsZiIsInNlcnZpY2U6ZmFjdHJhazpmdWxsIiwic2VydmljZTpkb3JtdHJhayIsInNlcnZpY2U6ZG9ybXRyYWs6d3JpdGUiLCJhZG1pbjphbGwiLCJzZXJ2aWNlOmZhY3RyYWs6YWRtaW4iXSwidG9rZW5MZXZlbCI6M30.Yahci9wBOYSzSVYP5An3RQwQkuBPaE-MhiowNG539v4";

    const action = {
      type: UPDATE_API_TOKEN,
      token,
    };

    const previousState = {
      scope: [],
      identityToken: "identityToken",
      expiry: 0,
      tokenLevel: 0,
    };

    const expectedNewState = {
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

    deepFreeze(previousState);
    const changedState = utilReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("updates whether to remember user", () => {
    const remember = true;
    const action = {
      type: UPDATE_REMEMBER,
      remember,
    };

    const previousState = { remember: false };
    const expectedNewState = { remember: true };

    deepFreeze(previousState);
    const changedState = utilReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("updates wso client", () => {
    const newWSO = DEFAULT_API_CLIENT;
    const action = {
      type: UPDATE_WSO,
      wso: newWSO,
    };

    const previousState = { wso: null };
    const expectedNewState = { wso: DEFAULT_API_CLIENT };

    deepFreeze(previousState);
    const changedState = utilReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("updates identityToken", () => {
    const newIdentityToken = "newIdentityToken";
    const action = {
      type: UPDATE_IDEN_TOKEN,
      token: newIdentityToken,
    };

    const previousState = { identityToken: "oldIdentityToken" };
    const expectedNewState = { identityToken: newIdentityToken };

    deepFreeze(previousState);
    const changedState = utilReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("removes credentials", () => {
    const action = {
      type: REMOVE_CREDS,
    };

    const previousState = {
      apiToken: "apiToken",
      currUser: { name: "hi" },
      expiry: 123812930,
      identityToken: "identityToken",
      remember: false,
      scope: ["service:bulletin", "service:users", "service:other"],

      tokenLevel: 3,
      wso: DEFAULT_API_CLIENT,
    };

    const expectedNewState = {
      apiToken: "",
      currUser: null,
      expiry: 0,
      identityToken: "",
      remember: false,
      scope: [],
      tokenLevel: 0,
      wso: DEFAULT_API_CLIENT,
    };

    deepFreeze(previousState);
    const changedState = utilReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("updates user", () => {
    const user = {
      admin: false,
      dorm: {
        id: 5,
        name: "Parsons",
        neighborhoodID: 15,
      },
      dormRoom: {
        number: "101",
        id: 10,
      },
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
    };
    const action = {
      type: UPDATE_USER,
      newUser: user,
    };

    const previousState = {
      scope: [],
      token: "",
      expiry: 0,
      currUser: null, // Stores the user object.
      remember: false,
      tokenLevel: 0,
    };

    const expectedNewState = {
      scope: [],
      token: "",
      expiry: 0,
      currUser: user,
      remember: false,
      tokenLevel: 0,
    };

    deepFreeze(previousState);
    const changedState = utilReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });
});
