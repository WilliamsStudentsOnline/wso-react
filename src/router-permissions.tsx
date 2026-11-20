import React from "react";
import { Navigate, useLocation } from "react-router";
import MoonLoader from "react-spinners/MoonLoader";
import { containsOneOfScopes, getTokenLevel, scopes } from "./lib/general";

/**
 * This file contains the necessary information to determine route permissions
 * based on user scopes and token level that will be checked with each state
 * transition.
 */

// ! It is very important to update this with every new policy change
interface RoutePermission {
  scopes?: string[];
  tokenLevel?: number;
}

const routePermissions: Record<string, RoutePermission> = {
  admin: { scopes: [scopes.ScopeAdminAll], tokenLevel: 3 },
  booktrak: { scopes: [scopes.ScopeBooktrak] },
  "booktrak.write": {
    scopes: [scopes.ScopeBooktrak, scopes.ScopeBooktrakWrite],
    tokenLevel: 3,
  },
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
  facebook: { scopes: [scopes.ScopeUsers] },
  factrak: { tokenLevel: 3 },
  goodrich: { tokenLevel: 3, scopes: [scopes.ScopeGoodrich] },
  "goodrich.manager": {
    tokenLevel: 3,
    scopes: [scopes.ScopeGoodrich, scopes.ScopeGoodrichManager],
  },
};

/**
 * Checks if the token has the necessary scopes to access a route.
 *
 * @param token - User API Token.
 * @param routeName - Route Name.
 */
const hasNecessaryScopes = (token: string, routeName: string) => {
  const { scopes: requiredScopes } = routePermissions[routeName];
  return !requiredScopes || containsOneOfScopes(token, requiredScopes);
};

/**
 * Checks if the token has the necessary token level to access a route.
 *
 * @param token - User API Token.
 * @param routeName - Route Name.
 */
const hasNecessaryTokenLevel = (token: string, routeName: string) => {
  const { tokenLevel } = routePermissions[routeName];
  return !tokenLevel || getTokenLevel(token) >= tokenLevel;
};

interface RequireScopeProps {
  token: string;
  name: string;
  children: React.ReactElement;
}

const RequireScope = ({ token, name, children }: RequireScopeProps) => {
  const location = useLocation();

  // API Token is not set yet, display loading screen
  if (token === "") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MoonLoader loading />
        <div style={{ marginTop: "1em", textAlign: "center" }}>
          Authenticating you with our server...
          <br />
          This may take a few seconds.
        </div>
      </div>
    );
  }

  // only render children if API Token is set and has the necessary scopes
  if (hasNecessaryScopes(token, name) && hasNecessaryTokenLevel(token, name)) {
    return children;
  }

  // otherwise, redirect to login page
  return (
    <Navigate
      to="/login"
      state={{
        from: location,
        requiredScopes: routePermissions[name].scopes || [],
        requiredLevel: routePermissions[name].tokenLevel || -1,
      }}
      replace
    />
  );
};

export default RequireScope;
