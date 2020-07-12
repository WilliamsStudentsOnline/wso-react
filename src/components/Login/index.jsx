// React imports
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux/Routing imports
import { connect } from "react-redux";
import { doUpdateIdentityToken, doUpdateRemember } from "../../actions/auth";
import { actions, createRouteNodeSelector } from "redux-router5";

// External imports
import {
  getCurrUser,
  getScopes,
  getTokenLevel,
  getWSO,
} from "../../selectors/auth";
import LoginBackground from "../../assets/images/LoginBackground.jpg";
import styles from "./Login.module.scss";
import WSO from "../../assets/images/brand/wso_icon_white_border.svg";
import {
  EuiCheckbox,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiFieldPassword,
  EuiButton,
  EuiSpacer,
  EuiIconTip,
} from "@elastic/eui";

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
  const [showErrors, setShowErrors] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState(null);

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

  const submitHandler = async (event) => {
    event.preventDefault();
    setShowErrors(true);

    // Guard clause for empty id or password field.
    if (unixID === "" || password === "") return;

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
        setErrors("Invalid unix or password provided!");
      }
    }
  };
  return (
    <div className={styles.page}>
      <img
        className={styles.background}
        src={LoginBackground}
        alt="Student at Sawyer Balcony"
      />
      <div className={styles.overlay} />
      <div className={styles.pageContent}>
        <div className={styles.aboutWSO}>
          <div>
            <img className={styles.icon} src={WSO} alt="WSO Logo" />
            <span className={styles.wso}>WSO</span>
          </div>
          <p className={styles.description}>
            Founded in 1995, WSO (Williams Students Online) is a student
            organization devoted to creating useful and innovative
            computer-based services and offering them to the Williams College
            community.
          </p>
        </div>

        <div className={styles.logInForm}>
          <EuiForm
            component="form"
            onSubmit={submitHandler}
            isInvalid={showErrors && errors}
            error={errors}
          >
            <EuiFormRow
              label={
                <>
                  Unix &nbsp;
                  <EuiIconTip position="right" content="e.g. abc9" />
                </>
              }
              isInvalid={showErrors && unixID === ""}
              error="Unix must not be blank!"
            >
              <EuiFieldText
                placeholder="Enter your unix"
                onChange={(event) => setUnix(event.target.value)}
                value={unixID}
                isInvalid={showErrors && unixID === ""}
              />
            </EuiFormRow>
            <EuiSpacer size="xl" />
            <EuiFormRow
              label={
                <>
                  Password &nbsp;
                  <EuiIconTip
                    position="right"
                    content="This is the same password as your email"
                  />
                </>
              }
              isInvalid={showErrors && password === ""}
              error="Password must not be blank!"
            >
              <EuiFieldPassword
                placeholder="Password"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                isInvalid={showErrors && password === ""}
              />
            </EuiFormRow>
            <EuiSpacer size="xl" />
            <EuiFormRow>
              <EuiCheckbox
                id="remember_me"
                checked={remember}
                onChange={() => setRemember(!remember)}
                label="Stay signed in"
              />
            </EuiFormRow>
            <EuiSpacer size="xxl" />

            <EuiButton className={styles.fullWidth} type="submit" fill>
              Login
            </EuiButton>
          </EuiForm>
          <EuiSpacer />
          <div className={`${styles.fullWidth} ${styles.forgotPassword}`}>
            <a href="https://pchanger.williams.edu/pchecker/">
              Forgot My Password
            </a>
          </div>
        </div>
      </div>
    </div>
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
