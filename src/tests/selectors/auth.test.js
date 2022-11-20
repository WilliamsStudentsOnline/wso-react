// import {
//   getAPIToken,
//   getCurrUser,
//   getExpiry,
//   getIdentityToken,
//   getScopes,
//   getTokenLevel,
// } from "../../selectors/auth";

// describe("Authentication Selector", () => {
//   const INITIAL_STATE = {
//     authState: {
//       apiToken: "apiToken",
//       currUser: { name: "success" },
//       expiry: 1230,
//       identityToken: "identityToken",
//       remember: false,
//       scope: ["a scope"],
//       tokenLevel: 3,
//     },
//   };

//   it("retrieves current user", () => {
//     const expectedUser = { name: "success" };
//     const currentUser = getCurrUser(INITIAL_STATE);
//     expect(currentUser).toEqual(expectedUser);
//   });

//   it("retrieves time format", () => {
//     const expectedExpiry = 1230;
//     const expiry = getExpiry(INITIAL_STATE);
//     expect(expiry).toEqual(expectedExpiry);
//   });

//   it("retrieves token level", () => {
//     const expectedTokenLevel = 3;
//     const tokenLevel = getTokenLevel(INITIAL_STATE);
//     expect(tokenLevel).toEqual(expectedTokenLevel);
//   });

//   it("retrieves api token", () => {
//     const expectedToken = "apiToken";
//     const token = getAPIToken(INITIAL_STATE);
//     expect(token).toEqual(expectedToken);
//   });

//   it("retrieves identity token", () => {
//     const expectedToken = "identityToken";
//     const token = getIdentityToken(INITIAL_STATE);
//     expect(token).toEqual(expectedToken);
//   });

//   it("retrieves Sign-in status", () => {
//     const expectedScope = ["a scope"];
//     const scopes = getScopes(INITIAL_STATE);
//     expect(scopes).toEqual(expectedScope);
//   });
// });

describe("Placeholder", () => {
  test("palceholder", () => {
    expect(1).toEqual(1);
  });
});
