import { containsScopes, getTokenLevel, scopes } from "./lib/general";

// ! It is very important to update this with every new policy change
const routePermissions = {
  bulletins: { scopes: [scopes.ScopeBulletin, scopes.ScopeUsers] },
  "bulletins.edit": {
    scopes: [scopes.ScopeBulletin, scopes.ScopeUsers],
    tokenLevel: 3,
  },
  "bulletins.new": {
    scopes: [scopes.ScopeBulletin, scopes.ScopeUsers],
    tokenLevel: 3,
  },
  discussions: { scopes: [scopes.ScopeBulletin, scopes.ScopeUsers] },
  "discussions.new": {
    tokenLevel: 3,
    scopes: [scopes.ScopeBulletin, scopes.ScopeUsers],
  },
  dormtrak: { tokenLevel: 3 },
  ephmatch: { scopes: [scopes.ScopeEphmatch] },
  facebook: { scopes: [scopes.ScopeUsers] },
  factrak: { tokenLevel: 3 },
};

const hasNecessaryScopes = (token, key) => {
  return (
    !routePermissions[key].scopes ||
    containsScopes(token, routePermissions[key].scopes)
  );
};

const hasNecessaryTokenLevel = (token, key) => {
  return (
    !routePermissions[key].tokenLevel ||
    getTokenLevel(token) >= routePermissions[key].tokenLevel
  );
};

export default (router, store) => {
  Object.keys(routePermissions).forEach((key) => {
    router.canActivate(key, () => (toState, fromState, done) => {
      const token = store.getState().authState.apiToken;

      if (
        hasNecessaryScopes(token, key) &&
        hasNecessaryTokenLevel(token, key)
      ) {
        return true;
      }

      return done({
        redirect: {
          name: "login",
          params: {
            previousRoute: toState,
            requiredScopes: routePermissions[key].scopes || [],
            requiredLevel: routePermissions[key].tokenLevel || -1,
          },
        },
      });
    });
  });
  router.canActivate("login", () => (toState, fromState, done) => {
    const token = store.getState().authState.token;

    if (getTokenLevel(token) >= 3) {
      return done({ redirect: { name: "home" } });
    }
    return true;
  });
};
