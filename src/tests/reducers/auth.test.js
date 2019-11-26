import deepFreeze from "deep-freeze";
import utilReducer from "../../reducers/auth";
import {
  UPDATE_TOKEN,
  UPDATE_USER,
  REMOVE_CREDS,
  UPDATE_REMEMBER,
} from "../../constants/actionTypes";

describe("Authentication reducer", () => {
  it("updates token", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzUxMzk2MTQsImlkIjoyLCJvcmlnX2lhdCI6MTU3NDUzNDgxNCwic2NvcGUiOlsic2VydmljZTpidWxsZXRpbiIsInNlcnZpY2U6dXNlcnMiLCJzZXJ2aWNlOm90aGVyIiwid3JpdGU6c2VsZiIsInNlcnZpY2U6ZmFjdHJhazpmdWxsIiwic2VydmljZTpkb3JtdHJhayIsInNlcnZpY2U6ZG9ybXRyYWs6d3JpdGUiLCJhZG1pbjphbGwiLCJzZXJ2aWNlOmZhY3RyYWs6YWRtaW4iXSwidG9rZW5MZXZlbCI6M30.Yahci9wBOYSzSVYP5An3RQwQkuBPaE-MhiowNG539v4";

    const action = {
      type: UPDATE_TOKEN,
      response: {
        token,
      },
    };

    const previousState = {
      scope: [],
      token: "",
      expiry: 0,
      tokenLevel: 0,
    };

    const expectedNewState = {
      token,
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

    const previousState = {
      remember: false,
    };

    const expectedNewState = {
      remember: true,
    };

    deepFreeze(previousState);
    const changedState = utilReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("removes credentials", () => {
    const action = {
      type: REMOVE_CREDS,
    };

    const previousState = {
      scope: ["service:bulletin", "service:users", "service:other"],
      token: "",
      expiry: 123812930,
      currUser: { name: "hi" }, // Stores the user object.
      remember: false,
      tokenLevel: 3,
    };

    const expectedNewState = {
      scope: [],
      token: "",
      expiry: 0,
      currUser: null, // Stores the user object.
      remember: false,
      tokenLevel: 0,
    };

    deepFreeze(previousState);
    const changedState = utilReducer(previousState, action);

    expect(changedState).toEqual(expectedNewState);
  });

  it("updates user", () => {
    const user = { name: "name" };
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
