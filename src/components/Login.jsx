// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/Routing imports
import { connect } from "react-redux";
import { doUpdateIdentityToken, doUpdateRemember } from "../actions/auth";
import { actions, createRouteNodeSelector } from "redux-router5";

// External imports
import {
  getCurrUser,
  getScopes,
  getTokenLevel,
  getWSO,
} from "../selectors/auth";

const Login = ({
  currUser,
  navigateTo,
  route,
  scopes,
  tokenLevel,
  updateIdenToken,
  updateRemember,
  wso,
}) => {
  const [unixID, setUnix] = useState("");
  const [password, setPassword] = useState("");
  const [errors, updateErrors] = useState([]);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    if (route.params.previousRoute) {
      if (route.params.requiredLevel) {
        if (
          tokenLevel < route.params.requiredLevel ||
          (route.params.requiredLevel > 2 && !currUser)
        ) {
          return;
        }
      }

      if (route.params.requiredScopes) {
        for (const scope of route.params.requiredScopes) {
          if (!scopes.includes(scope)) {
            return;
          }
        }
      }

      const { name, params } = route.params.previousRoute;
      navigateTo(name, params);
    }
    // Assumes wso, tokenLevel, and scopes are simultaneously updated
    // when token changes.
  }, [currUser, navigateTo, scopes, tokenLevel, route.params, wso]);

  // TODO: this shouldn't be coded this way. - it's better to do the splitting in the sign in.
  const unixHandler = (event) => {
    const splitValue = event.target.value.split("@");
    setUnix(splitValue[0]);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    // Guard clause for empty id or password field.
    if (unixID === "" || password === "") {
      updateErrors(["Please enter a valid Williams Username and password."]);
      return;
    }

    try {
      const tokenResponse = await wso.authService.getIdentityToken({
        unixID,
        password,
      });
      const identityToken = tokenResponse.token;

      updateRemember(remember);
      updateIdenToken(identityToken);
      navigateTo("home");
    } catch (error) {
      if (error.errorCode === 401) {
        updateErrors(["Invalid Williams Username or password!"]);
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
          {errors?.map((msg) => (
            <p key={msg}>{msg}</p>
          ))}
        </div>
        <br />
        <input
          type="text"
          id="unixID"
          placeholder="Enter your Williams Username (previously called Unix, eg. abc12) or email (eg. abc12@williams.edu)"
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
  currUser: PropTypes.object,
  navigateTo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  scopes: PropTypes.arrayOf(PropTypes.string),
  tokenLevel: PropTypes.number,
  updateIdenToken: PropTypes.func.isRequired,
  updateRemember: PropTypes.func.isRequired,
  wso: PropTypes.object.isRequired,
};

Login.defaultProps = {
  currUser: null,
  scopes: [],
  tokenLevel: 0,
};

const mapStateToProps = () => {
  const routeNodeSelector = createRouteNodeSelector("login");
  return (state) => ({
    currUser: getCurrUser(state),
    scopes: getScopes(state),
    tokenLevel: getTokenLevel(state),
    wso: getWSO(state),
    ...routeNodeSelector(state),
  });
};
const mapDispatchToProps = (dispatch) => ({
  navigateTo: (location, params, opts) =>
    dispatch(actions.navigateTo(location, params, opts)),
  updateIdenToken: (token) => dispatch(doUpdateIdentityToken(token)),
  updateRemember: (remember) => dispatch(doUpdateRemember(remember)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
