// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/Routing imports
import { connect } from "react-redux";
import {
  doUpdateToken,
  doUpdateUser,
  doUpdateRemember,
  doUpdateAPI,
} from "../actions/auth";
import { actions, createRouteNodeSelector } from "redux-router5";

// External imports
import { SimpleAuthentication } from "wso-api-client";
import { getAPI, getScopes, getTokenLevel } from "../selectors/auth";

const Login = ({
  api,
  navigateTo,
  route,
  scopes,
  tokenLevel,
  updateAPI,
  updateRemember,
  updateToken,
  updateUser,
}) => {
  const [unixID, setUnix] = useState("");
  const [password, setPassword] = useState("");
  const [errors, updateErrors] = useState([]);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    if (route.params.previousRoute) {
      if (route.params.requiredLevel) {
        if (tokenLevel < route.params.requiredLevel) {
          return;
        }
      }

      if (route.params.requiredScopes) {
        for (const scope of route.params.requiredScopes) {
          if (!scopes.indexOf(scope)) {
            return;
          }
        }
      }

      const { name, params } = route.params.previousRoute;

      navigateTo(name, params);
    }
    // Assumes API, tokenLevel, and scopes are simultaneously updated
    // when token changes.
  }, [api, tokenLevel, scopes, navigateTo, route.params]);

  const unixHandler = (event) => {
    const splitValue = event.target.value.split("@");
    setUnix(splitValue[0]);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    // Guard clause for empty id or password field.
    if (unixID === "" || password === "") {
      updateErrors(["Please enter a valid unixID and password."]);
      return;
    }

    try {
      const tokenResponse = await api.authService.loginV1({
        unixID,
        password,
      });
      const token = tokenResponse.token;
      const updatedAuth = new SimpleAuthentication(token);
      const updatedAPI = api.updateAuth(updatedAuth);
      const userResponse = await updatedAPI.userService.getUser("me");
      updateUser(userResponse.data);
      updateRemember(remember);
      updateAPI(updatedAPI);
      updateToken(token);
      navigateTo("home");
    } catch (error) {
      if (error.errors) {
        updateErrors(error.errors);
      }
    }
  };
  return (
    <header>
      <div className="page-head">
        <h1>Login</h1>
        <ul>
          <li>
            <a href="https://pchanger.williams.edu/pchecker/">
              Forgot My Password
            </a>
          </li>
        </ul>
      </div>

      <form onSubmit={submitHandler}>
        <div id="errors">
          {errors && errors.map((msg) => <p key={msg}>{msg}</p>)}
        </div>
        <br />
        <input
          type="text"
          id="unixID"
          placeholder="Enter your unix"
          onChange={unixHandler}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
        />

        <label htmlFor="remember_me">
          <input
            type="checkbox"
            id="remember_me"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          Remember me
        </label>
        <input
          type="submit"
          name="commit"
          value="Login"
          className="submit"
          data-disable-with="Login"
        />
      </form>
    </header>
  );
};

Login.propTypes = {
  api: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  scopes: PropTypes.arrayOf(PropTypes.string),
  tokenLevel: PropTypes.number,
  updateAPI: PropTypes.func.isRequired,
  updateRemember: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  updateToken: PropTypes.func.isRequired,
};

Login.defaultProps = {
  scopes: [],
  tokenLevel: 0,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("login");
  return (state) => ({
    api: getAPI(state),
    scopes: getScopes(state),
    tokenLevel: getTokenLevel(state),
    ...routeNodeSelector(state),
  });
};
const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
  updateAPI: (api) => dispatch(doUpdateAPI(api)),
  updateRemember: (remember) => dispatch(doUpdateRemember(remember)),
  updateToken: (response) => dispatch(doUpdateToken(response)),
  updateUser: (unixID) => dispatch(doUpdateUser(unixID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
