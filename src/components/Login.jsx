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

const Login = ({ navigateTo, updateToken, updateUser }) => {
  const [unixID, setUnix] = useState("");
  const [password, setPassword] = useState("");

  /* @TODO: convert email addresses to unix */
  const unixHandler = (event) => {
    setUnix(event.target.value);
  };

  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const response = await getToken(unixID, password);

    if (!response) {
      // handle error
    } else {
      // redirects to home
      updateToken(response);
      // @TODO: use the returned token.
      const newToken = response.data.data.token;
      const user = await getUser("me", newToken);
      if (!user) {
        // handle error
      } else {
        updateUser(user);
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
          name="unixID"
          id="unixID"
          placeholder="Enter your unix"
          onChange={unixHandler}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          onChange={passwordHandler}
        />

        {/* @TODO: check how best to handle this */}
        <label htmlFor="remember_me">
          <input
            type="checkbox"
            name="remember_me"
            id="remember_me"
            value="1"
            defaultChecked
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
  updateToken: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  updateToken: (response) => dispatch(doUpdateToken(response)),
  updateUser: (unixID) => dispatch(doUpdateUser(unixID)),
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
});

export default connect(
  null,
  mapDispatchToProps
)(Login);
