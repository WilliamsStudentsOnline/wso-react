// React imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux imports
import { connect } from "react-redux";
import { doUpdateToken, doUpdateUser } from "../actions/auth";

// External imports
import { getToken } from "../api/auth";
import { actions } from "redux-router5";
import { getUser } from "../api/users";
import { checkAndHandleError } from "../lib/general";
import jwtDecode from "jwt-decode";

const Login = ({ navigateTo, updateToken, updateUser }) => {
  const [unixID, setUnix] = useState("");
  const [password, setPassword] = useState("");
  // const [remember, setRemember] = useState(false);

  const unixHandler = (event) => {
    const splitValue = event.target.value.split("@");
    setUnix(splitValue[0]);
  };

  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const response = await getToken(unixID, password);
    if (checkAndHandleError(response)) {
      const newToken = response.data.data.token;
      const decoded = jwtDecode(newToken);
      const userResponse = await getUser(newToken, decoded.id);
      if (checkAndHandleError(userResponse)) {
        // Only update if both requests pass.
        updateUser(userResponse.data.data);
        updateToken(response.data.data);
        // updateRemember(remember);
        navigateTo("home");
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
          onChange={passwordHandler}
        />
        {/* @TODO: Saving state between tabs but not between sessions. 
        <label htmlFor="remember_me">
          <input
            type="checkbox"
            id="remember_me"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          Remember me
        </label> */}
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
  updateToken: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  // updateRemember: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  updateToken: (response) => dispatch(doUpdateToken(response)),
  updateUser: (unixID) => dispatch(doUpdateUser(unixID)),
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
  // updateRemember: (remember) => dispatch(doUpdateRemember(remember)),
});

export default connect(
  null,
  mapDispatchToProps
)(Login);
