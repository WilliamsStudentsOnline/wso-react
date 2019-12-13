import {
  getCurrUser,
  getExpiry,
  getToken,
  getScopes,
  getTokenLevel,
} from "../../selectors/auth";

describe("Authentication Selector", () => {
  const INITIAL_STATE = {
    authState: {
      scope: ["a scope"],
      token: "token",
      expiry: 1230,
      currUser: { name: "success" },
      remember: false,
      tokenLevel: 3,
    },
  };

  it("retrieves current user", () => {
    const expectedUser = { name: "success" };
    const currentUser = getCurrUser(INITIAL_STATE);
    expect(currentUser).toEqual(expectedUser);
  });

  it("retrieves time format", () => {
    const expectedExpiry = 1230;
    const expiry = getExpiry(INITIAL_STATE);
    expect(expiry).toEqual(expectedExpiry);
  });

  it("retrieves token level", () => {
    const expectedTokenLevel = 3;
    const tokenLevel = getTokenLevel(INITIAL_STATE);
    expect(tokenLevel).toEqual(expectedTokenLevel);
  });

  it("retrieves token", () => {
    const expectedToken = "token";
    const token = getToken(INITIAL_STATE);
    expect(token).toEqual(expectedToken);
  });

  it("retrieves Sign-in status", () => {
    const expectedScope = ["a scope"];
    const scopes = getScopes(INITIAL_STATE);
    expect(scopes).toEqual(expectedScope);
  });
});
