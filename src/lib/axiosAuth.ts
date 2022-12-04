import { updateAPIToken, removeCredentials } from "./authSlice";
import jwtDecode from "jwt-decode";
import { WSO } from "wso-api-client";

import history from "./history";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import { WSOToken } from "./types";
import type rootStore from "./store";

function isText(data: unknown): data is string {
  return typeof data === "string";
}

type RootStore = typeof rootStore;

// prevent circular dependency
// see https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
let store: RootStore;
export const injectStore = (_store: RootStore) => {
  store = _store;
};

/**
 * Checks whether the request is made with a token header. We claim that this is
 * true if the header begins with "Authorization: Bearer ".
 *
 * @param {AxiosRequestConfig} config
 */
const hasTokenHeader = (config: AxiosRequestConfig) => {
  const auth = config?.headers?.Authorization;
  if (!isText(auth)) {
    return false;
  }
  return auth.length > 7;
};

/**
 * Gets a new API token and updates it in store.
 * The reducer will then automatically update the axios instance.
 *
 * @returns Updated token
 */
const refreshAPIToken = async () => {
  const authState = store.getState().authState;

  let token;
  try {
    const tokenResponse = await authState.wso.authService.getAPIToken(
      authState.identityToken
    );
    token = tokenResponse.token;
    store.dispatch(updateAPIToken(token));
  } catch (error) {
    // on error (likely due to expired identityToken),
    // remove all credentials and redirect to login
    store.dispatch(removeCredentials());
    history.push("/login");
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
export const tokenIsExpired = (token: string) => {
  try {
    const decoded = jwtDecode<WSOToken>(token);
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
const configureRequestInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use((config) => {
    if (hasTokenHeader(config) && !config.url?.includes("auth")) {
      const token = (config.headers?.Authorization as string).substring(7);

      if (tokenIsExpired(token)) {
        // If the token is expired, do not send the request
        const controller = new AbortController();
        const updatedConfig = { ...config, signal: controller.signal };
        controller.abort();

        refreshAPIToken();

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
const configureResponseInterceptors = (api: AxiosInstance) => {
  api.interceptors.response.use((response) => {
    if (
      response.config.url !== "/api/v2/auth/api/refresh" &&
      response.data.updateToken
    )
      refreshAPIToken();

    return response;
  });
};

// Declared in this manner to let it be hoisted
function configureInterceptors(wso: WSO) {
  const api = wso.api.api;
  configureRequestInterceptors(api);
  configureResponseInterceptors(api);
}

export default configureInterceptors;
