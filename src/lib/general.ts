import jwtDecode from "jwt-decode";
import type { WSOToken } from "./types";

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

  ScopeBulletin: "service:bulletin",
  // This is for facebook & users
  ScopeUsers: "service:users",
  // Allows you to access other services not mentioned above
  ScopeAllOther: "service:other",

  // Service: Goodrich
  // Allows access to read/write self goodrich orders and read goodrich menu
  ScopeGoodrich: "service:goodrich",
  // Allows access to read/write all goodrich orders and read/write goodrich menu
  ScopeGoodrichManager: "service:goodrich:manager",

  // Service: Booktrak
  // Allows access to read booktrak listings
  ScopeBooktrak: "service:booktrak",
  // Allows access to create/modify booktrak listings
  ScopeBooktrakWrite: "service:booktrak:write",
};

/**
 * Checks if token contains any of the given scopes.
 *
 * @param token - API token string.
 * @param scopesToCheck - scopes to be checked against.
 */
export const containsOneOfScopes = (token: string, scopesToCheck: string[]) => {
  try {
    const decoded = jwtDecode<WSOToken>(token);
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

/**
 * Checks if token contains any of the given scopes.
 *
 * @param tokenScopes - API token string.
 * @param scopesToCheck - scopes to be checked against.
 */
export const scopesContainsOneOfScopes = (
  tokenScopes: string[] | undefined,
  scopesToCheck: string[]
) => {
  try {
    if (tokenScopes) {
      for (let i = 0; i < scopesToCheck.length; i += 1) {
        if (tokenScopes.indexOf(scopesToCheck[i]) !== -1) return true;
      }
    }
  } catch (err) {
    return false;
  }

  return false;
};

/**
 * Checks if token contains all of the given scopes.
 *
 * @param token - API token string.
 * @param scopesToCheck - scopes to be checked against.
 */
export const containsAllOfScopes = (token: string, scopesToCheck: string[]) => {
  try {
    const decoded = jwtDecode<WSOToken>(token);
    if (decoded.scope) {
      for (let i = 0; i < scopesToCheck.length; i += 1) {
        if (decoded.scope.indexOf(scopesToCheck[i]) === -1) return false;
      }
    }
  } catch (err) {
    return false;
  }

  return true;
};

/**
 * Retrieves the token level of a given token.
 *
 * 0 - Unauthenticated User out of Williams IP address
 * 1 - Unauthenticated User in Williams IP address
 * 3 - Authenticated User
 *
 * @param token - API token string.
 */
export const getTokenLevel = (token: string) => {
  try {
    const decoded = jwtDecode<WSOToken>(token);
    if (decoded.tokenLevel) {
      return decoded.tokenLevel;
    }
  } catch (err) {
    return -1;
  }

  return -1;
};

/**
 * Capitalizes the first letter of the string.
 *
 * @param string - String to be capitalized.
 */
export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const pascalToTitleCase = (string: string) => {
  return string.replace(/([a-z])([A-Z])/g, "$1 $2");
};
