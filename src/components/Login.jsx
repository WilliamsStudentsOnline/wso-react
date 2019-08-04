// React imports
import React, { useState } from "react";

// Redux imports
import { connect } from "react-redux";
import { doUpdateToken, doUpdateUser } from "../actions/auth";

// External imports
import { getToken } from "../api/utils";
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
      //handle error
    } else {
      // redirects to home
      console.log(response);
      updateToken(response);
      const user = await getUser("me");
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

const mapDispatchToProps = (dispatch) => ({
  updateToken: (response) => dispatch(doUpdateToken(response)),
  updateUser: (unixID) => dispatch(doUpdateUser(unixID)),
  navigateTo: (location) => dispatch(actions.navigateTo(location)),
});

export default connect(
  null,
  mapDispatchToProps
)(Login);
