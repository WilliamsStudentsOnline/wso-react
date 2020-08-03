import { doUpdateAPIToken, doUpdateUser, doUpdateWSO } from "../actions/auth";
import jwtDecode from "jwt-decode";
import { SimpleAuthentication } from "wso-api-client";
import { actions } from "redux-router5";

/**
 * Checks whether the request is made with a token header. We claim that this is
 * true if the header begins with "Authorization: Bearer ".
 *
 * @param {AxiosRequestConfig} config
 */
const hasTokenHeader = (config) => {
  return config?.headers?.Authorization?.length > 7;
};

/**
 * Gets a new API token and updates it in store.
 *
 * @returns Updated token
 */
const updateAPIToken = async () => {
  const authState = window.store.getState().authState;

  let token;
  try {
    const tokenResponse = await authState.wso.authService.getAPIToken(
      authState.identityToken
    );
    token = tokenResponse.token;
    const wso = authState.wso;

    const auth = new SimpleAuthentication(token);
    const updatedWSO = wso.updateAuth(auth);
    configureInterceptors(updatedWSO);

    const userResponse = await updatedWSO.userService.getUser("me");
    const user = userResponse.data;

    window.store.dispatch(doUpdateAPIToken(token));
    window.store.dispatch(doUpdateWSO(updatedWSO));
    window.store.dispatch(doUpdateUser(user));
  } catch (error) {
    // eslint-disable no-empty

    window.store.dispatch(actions.navigateTo("login"));
    return null;
  }
  return token;
};

/**
 * Checks if the current API token is expired. Returns true if the token is
 * expired, false otherwise. We require the token that is being used, rather
 * than checking the token in store because the authState might not be updated
 * (e.g. when initializing). Returns true if there is no token
 *
 * @param {String} token - JWT Token
 */
const tokenIsExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (decoded?.exp) {
      return new Date().getTime() > decoded.exp * 1000;
    }
  } catch (err) {
    return true;
  }

  return true;
};

/**
 * Configures the axios request interceptors for `api` to check if our current
 * API token is expired each time a request is made, requesting a new token if
 * so.
 *
 * @param api - the WSO API object used to make our requests.
 */
const configureRequestInterceptors = (api) => {
  api.interceptors.request.use(async (config) => {
    if (hasTokenHeader(config) && !config.url.includes("auth")) {
      const token = config.headers.Authorization.substring(7);

      if (tokenIsExpired(token)) {
        const newToken = await updateAPIToken();

        const updatedConfig = { ...config };
        updatedConfig.headers.Authorization = `Bearer ${newToken}`;
        return updatedConfig;
      }
    }
    return config;
  });
};

/**
 * Configures the axios response interceptors for `api` to check if we need to update
 * our API token each time a reponse is received, requesting a token if so.
 *
 * @param api - the WSO API object used to make our requests.
 */
const configureResponseInterceptors = (api) => {
  api.interceptors.response.use(async (response) => {
    if (
      response.config.url !== "/api/v2/auth/api/refresh" &&
      response.data.updateToken
    )
      await updateAPIToken();

    return response;
  });
};

// Declared in this manner to let it be hoisted
function configureInterceptors(wso) {
  const api = wso.api.api;
  configureRequestInterceptors(api);
  configureResponseInterceptors(api);
}

export default configureInterceptors;
