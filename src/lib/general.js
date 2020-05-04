// import { actions } from "redux-router5";
// import { doUpdateToken, doUpdateUser } from "../actions/auth";
import jwtDecode from "jwt-decode";

// The current scopes
export const scopes = {
  // Global scopes:
  ScopeAdminAll: "admin:all",
  // Allows client to do write-level requests as long as it is scoped to models involving self, not all models
  ScopeWriteSelf: "write:self",

  // Service scopes. Permits clients to access services read only. If it is included with the global write-self scope,
  // allows write access to service, iff it is scoped to models owned and allowed to be edited by self.

  // Service: Factrak
  // Limited access to factrak for people with outstanding survey deficit
  ScopeFactrakLimited: "service:factrak:limited",
  // Full access to factrak for people with no survey deficit. Includes everything from ScopeFactrakLimited.
  ScopeFactrakFull: "service:factrak:full",
  // Allows admin access to factrak. This includes everything from ScopeFactrakFull, while also opening up
  // admin endpoints and allowing certain admin-level write actions (need write-self for normal actions, though).
  ScopeFactrakAdmin: "service:factrak:admin",

  // Service: Dormtrak
  // Access to dormtrak reviews, etc.
  ScopeDormtrak: "service:dormtrak",
  // Ability to create reviews, etc. (must be upperclass)
  ScopeDormtrakWrite: "service:dormtrak:write",

  ScopeEphcatch: "service:ephcatch",
  ScopeBulletin: "service:bulletin",
  // This is for facebook & users
  ScopeUsers: "service:users",
  // Allows you to access other services not mentioned above
  ScopeAllOther: "service:other",

  ScopeEphmatch: "service:ephmatch",
};

// Assumes a valid and error-free response
// export const checkAndUpdateUser = async (response) => {
//   if (response.data.updateToken) {
//     const token = window.store.getState().authState.token;
//     if (token === "") return;
//     const updateResponse = await updateTokenAPI(token);
//     if (updateResponse.status === 200) {
//       window.store.dispatch(doUpdateToken(updateResponse.data.data));
//       const decoded = jwtDecode(token);
//       const userResponse = await getUser(token, decoded.id);
//       if (userResponse.status === 200) {
//         window.store.dispatch(doUpdateUser(userResponse.data.data));
//       }
//     }
//   }
// };

// Checks if a given token contains scopes
export const containsScopes = (token, scopesToCheck) => {
  try {
    const decoded = jwtDecode(token);
    if (decoded.scope) {
      for (let i = 0; i < scopesToCheck.length; i += 1) {
        if (decoded.scope.indexOf(scopesToCheck[i]) !== -1) return true;
      }
    }
  } catch (err) {
    return false;
  }

  return false;
};

// Gets the token level of a given token
export const getTokenLevel = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (decoded.tokenLevel) {
      return decoded.tokenLevel;
    }
  } catch (err) {
    return -1;
  }

  return -1;
};

// Returns true if there is no error and the status is OK
// export const checkAndHandleError = (response, token = "") => {
//   if (response && response.status) {
//     switch (response.status) {
//       case 200: // GET request succeded
//       case 201: // PATCH request updated
//         checkAndUpdateUser(response, token);
//         return true;
//       case 500:
//         return false; // return store.dispatch(actions.navigateTo("500"));
//       default:
//         return false;
//     }
//   }
//   // handle error
//   return false;
// };

// Capitalize the first letter of the string.
export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Adds or remove days from a date (String).
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
