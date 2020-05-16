import { doUpdateAPIToken } from "../actions/auth";

// We claim that it uses a token header if the header has "Authorization: Bearer "
// or "Authorization: Bearer {token}"
const hasTokenHeader = (config) => {
  return config?.headers?.Authorization?.length > 7;
};

const updateAPIToken = async () => {
  const authState = window.store.getState().authState;
  try {
    const tokenResponse = await authState.wso.authService.refreshAPIToken(
      authState.apiToken
    );
    window.store.dispatch(doUpdateAPIToken(tokenResponse.token));
  } catch (error) {
    // eslint-disable no-empty
  }
};

const tokenIsExpired = () => {
  const authState = window.store.getState().authState;
  return new Date().getTime() > authState.expiry;
};

const configureRequestInterceptors = (api) => {
  api.interceptors.request.use(async (config) => {
    if (
      hasTokenHeader(config) &&
      !config.url.includes("auth") &&
      tokenIsExpired()
    ) {
      updateAPIToken();
    }

    return config;
  });
};

const configureResponseInterceptors = (api) => {
  api.interceptors.response.use(async (response) => {
    if (response.updateToken) updateAPIToken();

    return response;
  });
};

const configureInterceptors = (wso) => {
  const api = wso.api.api;
  configureRequestInterceptors(api);
  configureResponseInterceptors(api);
};

export default configureInterceptors;
