const getCurrUser = ({ authState }) => authState.currUser;
const getExpiry = ({ authState }) => authState.expiry;
const getIdentityToken = ({ authState }) => authState.identityToken;
const getAPIToken = ({ authState }) => authState.apiToken;
const getScopes = ({ authState }) => authState.scope;
const getTokenLevel = ({ authState }) => authState.tokenLevel;
const getAPI = ({ authState }) => authState.api;

export {
  getAPI,
  getAPIToken,
  getCurrUser,
  getExpiry,
  getIdentityToken,
  getScopes,
  getTokenLevel,
};
