import React from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { containsOneOfScopes, getTokenLevel, scopes } from "./lib/general";

/**
 * This file contains the necessary information to determine route permissions
 * based on user scopes and token level that will be checked with each state
 * transition.
 */

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
  ephmatch: { tokenLevel: 3 },
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
 * @param {String} token - User API Token.
 * @param {String} routeName - Route Name.
 */
const hasNecessaryScopes = (token, routeName) => {
  return (
    !routePermissions[routeName].scopes ||
    containsOneOfScopes(token, routePermissions[routeName].scopes)
  );
};

/**
 * Checks if the token has the necessary token level to access a route.
 *
 * @param {String} token - User API Token.
 * @param {String} routeName - Route Name.
 */
const hasNecessaryTokenLevel = (token, routeName) => {
  return (
    !routePermissions[routeName].tokenLevel ||
    getTokenLevel(token) >= routePermissions[routeName].tokenLevel
  );
};

const RequireScope = ({ token, name, children }) => {
  const location = useLocation();

  if (hasNecessaryScopes(token, name) && hasNecessaryTokenLevel(token, name)) {
    return children;
  }

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

RequireScope.propTypes = {
  token: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default RequireScope;
