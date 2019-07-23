// React imports
import React from 'react';
import PropTypes from 'prop-types';
import Layout from './Layout';

const Login = ({ authToken, currentUser, notice, warning }) => {
  return (
    <Layout
      bodyClass="account"
      notice={notice}
      warning={warning}
      currentUser={currentUser}
    >
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

        <form
          action="/account/login?class=login"
          acceptCharset="UTF-8"
          method="post"
        >
          <input name="utf8" type="hidden" value="✓" />
          <input type="hidden" name="authenticity_token" value={authToken} />
          <input type="hidden" name="dest" id="dest" />

          <br />

          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your unix"
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />

          <label htmlFor="remember_me">
            <input
              type="checkbox"
              name="remember_me"
              id="remember_me"
              value="1"
              checked="checked"
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
    </Layout>
  );
};

Login.propTypes = {
  authToken: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  notice: PropTypes.string,
  warning: PropTypes.string,
};

Login.defaultProps = {
  currentUser: {},
  notice: '',
  warning: '',
};

export default Login;
