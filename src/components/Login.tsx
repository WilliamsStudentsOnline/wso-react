// React imports
import React, { useState, useEffect } from "react";

// Redux/Routing imports
import {
  getWSO,
  getCurrUser,
  getScopes,
  getTokenLevel,
} from "../lib/authSlice";
import { updateIdentityToken, updateRemember } from "../lib/authSlice";
import { useAppSelector, useAppDispatch } from "../lib/store";
import { useNavigate, useLocation } from "react-router-dom";

// External imports

const Login = () => {
  const dispatch = useAppDispatch();
  const currUser = useAppSelector(getCurrUser);
  const wso = useAppSelector(getWSO);
  const scopes = useAppSelector(getScopes);
  const tokenLevel = useAppSelector(getTokenLevel);

  // TODO: if user already log in, should go back in history or to homepage

  const location = useLocation();
  // TODO: set type of location.state during redirect
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const state = location.state as any;
  const navigateTo = useNavigate();

  const [unixID, setUnix] = useState("");
  const [password, setPassword] = useState("");
  const [errors, updateErrors] = useState<string[] | never>([]);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    if (state?.from) {
      // if requirements not satisfied, do not go back
      if (state.requiredLevel) {
        if (
          tokenLevel < state.requiredLevel ||
          (state.requiredLevel > 2 && !currUser)
        ) {
          return;
        }
      }

      if (state.requiredScopes) {
        for (const scope of state.requiredScopes) {
          if (!scopes.includes(scope)) {
            return;
          }
        }
      }

      // TODO: reconsider if we need to recover location.state in the previous page
      // right now we do not recover it.
      navigateTo(state.from, { replace: true });
    }
    // Assumes wso, tokenLevel, and scopes are simultaneously updated
    // when token changes.
  }, [currUser, scopes, tokenLevel, state, wso]);

  // TODO: this shouldn't be coded this way. - it's better to do the splitting in the sign in.
  const unixHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const splitValue = event.target.value.split("@");
    setUnix(splitValue[0]);
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
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

      dispatch(updateRemember(remember));
      dispatch(updateIdentityToken(identityToken));
      navigateTo("/");
    } catch (error) {
      // TODO: error type => should be defined by wso-api-client
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any).errorCode === 401) {
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

export default Login;
